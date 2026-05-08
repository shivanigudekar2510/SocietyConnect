import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { useAppContext, WalkIn } from '../context/AppContext';
import Icon from 'react-native-vector-icons/Ionicons';

const VisitorHistoryScreen = ({ navigation }: any) => {
  const { walkIns } = useAppContext();

  // Filter visitors that belong to the resident's flat ('Flat 402')
  const myVisitorHistory = walkIns.filter(w => w.flat === 'Flat 402');

  const renderHistoryItem = ({ item }: { item: WalkIn }) => {
    let statusColor = '#6B7280';
    let statusBg = '#F3F4F6';
    if (item.status === 'Approved') { statusColor = '#10B981'; statusBg = '#E8F5E9'; }
    if (item.status === 'Denied') { statusColor = '#EF4444'; statusBg = '#FFEBEE'; }
    if (item.status === 'Pending') { statusColor = '#F59E0B'; statusBg = '#FFF8E1'; }

    const iconName = 
      item.type === 'Delivery' ? 'cube' : 
      item.type === 'Cab' ? 'car' : 
      item.type === 'Service' ? 'hammer' : 'person';

    return (
      <View style={styles.logCard}>
        <View style={styles.logLeft}>
          <View style={[styles.iconCircle, { backgroundColor: statusBg }]}>
            <Icon name={iconName} size={22} color={statusColor} />
          </View>
          <View style={styles.logDetails}>
            <Text style={styles.logName}>{item.name}</Text>
            <Text style={styles.logMeta}>{item.type} • {item.time}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
      {/* Curved Blue Header matching Resident Theme */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Visitor History</Text>
            <Text style={styles.headerSubtitle}>Past guests, deliveries, and cabs</Text>
          </View>
        </View>
      </View>

      <View style={styles.mainArea}>
        {myVisitorHistory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="people-outline" size={60} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No Visitor Records Yet</Text>
            <Text style={styles.emptySub}>All approved or denied visitor requests appear here.</Text>
          </View>
        ) : (
          <FlatList
            data={myVisitorHistory}
            renderItem={renderHistoryItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { 
    backgroundColor: '#1E3A8A', 
    height: 120, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    paddingHorizontal: 20, 
    paddingTop: 15
  },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, color: 'white', fontWeight: 'bold' },
  headerSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },

  mainArea: { flex: 1, marginTop: -20 },
  listContainer: { padding: 20, paddingBottom: 110 },
  
  logCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5
  },
  logLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconCircle: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  logDetails: { flex: 1 },
  logName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 },
  logMeta: { fontSize: 13, color: '#64748B' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: 'bold' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#475569', marginTop: 15 },
  emptySub: { fontSize: 14, color: '#94A3B8', textAlign: 'center', marginTop: 6 }
});

export default VisitorHistoryScreen;
