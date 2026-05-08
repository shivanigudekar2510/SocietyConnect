import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AdminHelpdeskScreen = ({ navigation }: any) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Resolved'>('Pending');
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      const unsubscribe = firestore().collection('tickets').onSnapshot((snap: any) => {
        if (!snap) return;
        const docs: any[] = [];
        snap.forEach((doc: any) => {
          const data = doc.data();
          docs.push({
            id: doc.id,
            user: data.flat || 'Flat 402',
            issue: data.issue,
            category: data.category,
            status: data.status || 'Pending',
            photo: data.photo || null
          });
        });
        setTickets(docs);
      });
      return unsubscribe;
    } catch (e) {
      console.log('Error listening to tickets', e);
    }
  }, []);

  const handleResolve = (id: string) => {
    Alert.alert('Mark Resolved', 'Has this issue been fixed?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Yes, Resolved', 
        onPress: async () => {
          try {
            const firestore = require('@react-native-firebase/firestore').default;
            await firestore().collection('tickets').doc(id).update({ status: 'Resolved' });
            Alert.alert('Success', 'Ticket marked as resolved.');
          } catch (err) {
            console.log('Error updating ticket status', err);
          }
        } 
      }
    ]);
  };

  const filteredTickets = tickets.filter(ticket => {
    if (activeFilter === 'All') return true;
    return ticket.status === activeFilter;
  });

  const renderTicket = ({ item }: any) => (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketUser}>{item.user}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'Pending' ? '#FEE2E2' : '#D1FAE5' }]}>
          <Text style={[styles.statusText, { color: item.status === 'Pending' ? '#DC2626' : '#059669' }]}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.ticketCategory}>{item.category} Issue</Text>
      <Text style={styles.ticketIssue}>{item.issue}</Text>

      {item.photo ? (
        <View style={styles.previewImageContainer}>
          <Image source={{ uri: item.photo }} style={styles.previewImage} />
        </View>
      ) : null}
      
      {item.status !== 'Resolved' && (
        <>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.resolveBtn} onPress={() => handleResolve(item.id)}>
            <Icon name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.resolveBtnText}>Mark Resolved</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Helpdesk Admin</Text>
        <View style={{ width: 40 }} />
      </View>

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

      <FlatList
        data={filteredTickets}
        renderItem={renderTicket}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
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
  listContent: { padding: 20 },
  ticketCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: '#F3F4F6', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5
  },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  ticketUser: { fontWeight: 'bold', color: '#374151' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  ticketCategory: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  ticketIssue: { fontSize: 14, color: '#4B5563', marginBottom: 15 },
  previewImageContainer: {
    width: '100%', height: 140, borderRadius: 12, overflow: 'hidden', marginBottom: 15,
    borderWidth: 1, borderColor: '#F3F4F6'
  },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 15 },
  resolveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  resolveBtnText: { color: '#10B981', fontWeight: 'bold', fontSize: 15 }
});

export default AdminHelpdeskScreen;
