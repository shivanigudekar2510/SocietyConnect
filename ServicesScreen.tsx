import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, FlatList, 
  SafeAreaView, StatusBar, Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ServiceTicket {
  id: string;
  ticketNo: string;
  category: string;
  issue: string;
  date: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  photo?: string | null;
}

const ServicesScreen = ({ navigation }: any) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Resolved'>('All');
  const [tickets, setTickets] = useState<ServiceTicket[]>([]);

  useEffect(() => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      const unsubscribe = firestore().collection('tickets').onSnapshot((snap: any) => {
        if (!snap) return;
        const docs: ServiceTicket[] = [];
        snap.forEach((doc: any) => docs.push({ id: doc.id, ...doc.data() }));
        if (docs.length > 0) {
          setTickets(docs);
        }
      });
      return unsubscribe;
    } catch (e) {
      console.log('Error loading tickets from Firestore', e);
    }
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Pending') return ticket.status === 'Pending' || ticket.status === 'In Progress';
    return ticket.status === 'Resolved';
  });

  const getStatusStyle = (status: ServiceTicket['status']) => {
    switch (status) {
      case 'Pending': return { bg: '#FEE2E2', text: '#DC2626' }; 
      case 'In Progress': return { bg: '#FEF3C7', text: '#D97706' }; 
      case 'Resolved': return { bg: '#D1FAE5', text: '#059669' }; 
    }
  };

  const renderTicket = ({ item }: { item: ServiceTicket }) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <View style={styles.ticketCard}>
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketNo}>{item.ticketNo}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.categoryText}>{item.category} Issue</Text>
        <Text style={styles.issueText}>{item.issue}</Text>

        {item.photo ? (
          <View style={styles.previewImageContainer}>
            <Image source={{ uri: item.photo }} style={styles.previewImage} />
          </View>
        ) : null}

        <View style={styles.divider} />
        
        <View style={styles.ticketFooter}>
          <Text style={styles.dateText}>Raised on: {item.date}</Text>
          {item.status !== 'Resolved' && (
            <TouchableOpacity>
              <Text style={styles.actionText}>Remind</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Helpdesk & Services</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {['All', 'Pending', 'Resolved'].map((filter) => (
          <TouchableOpacity 
            key={filter}
            style={[styles.filterPill, activeFilter === filter && styles.activeFilterPill]}
            onPress={() => setActiveFilter(filter as any)}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Ticket List */}
      <FlatList
        data={filteredTickets}
        keyExtractor={(item) => item.id}
        renderItem={renderTicket}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="sparkles" size={40} color="#6B7280" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No requests found.</Text>
          </View>
        }
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity 
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('CreateTicket')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: 20, paddingVertical: 15 
  },
  backButton: { 
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', 
    justifyContent: 'center', alignItems: 'center',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  filterContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15, gap: 10 },
  filterPill: { 
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, 
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB' 
  },
  activeFilterPill: { backgroundColor: '#111827', borderColor: '#111827' },
  filterText: { color: '#6B7280', fontSize: 14, fontWeight: '600' },
  activeFilterText: { color: '#FFFFFF' },
  listContainer: { padding: 20, paddingBottom: 100 },
  ticketCard: { 
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 16,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5
  },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  ticketNo: { color: '#6B7280', fontSize: 13, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  categoryText: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  issueText: { fontSize: 14, color: '#4B5563', marginBottom: 15, lineHeight: 20 },
  previewImageContainer: {
    width: '100%', height: 140, borderRadius: 12, overflow: 'hidden', marginBottom: 15,
    borderWidth: 1, borderColor: '#F3F4F6'
  },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 12 },
  ticketFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { color: '#9CA3AF', fontSize: 12 },
  actionText: { color: '#2563EB', fontSize: 14, fontWeight: 'bold' },
  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyIcon: { marginBottom: 10 },
  emptyText: { color: '#6B7280', fontSize: 16 },
  fab: { 
    position: 'absolute', bottom: 100, right: 20, 
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#2563EB', 
    justifyContent: 'center', alignItems: 'center',
    elevation: 8, shadowColor: '#2563EB', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }
  },
  fabIcon: { color: '#FFFFFF', fontSize: 30, fontWeight: '300', marginTop: -2 }
});

export default ServicesScreen;