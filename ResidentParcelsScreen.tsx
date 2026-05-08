import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { useAppContext, Parcel } from '../context/AppContext';
import Icon from 'react-native-vector-icons/Ionicons';

const ResidentParcelsScreen = ({ navigation }: any) => {
  const { parcels } = useAppContext();

  // Show all parcels for my flat
  const myParcels = parcels.filter(p => p.flat === 'Flat 402');

  const renderParcelItem = ({ item }: { item: Parcel }) => {
    const isCollected = item.status === 'Collected';
    return (
      <View style={[styles.parcelCard, isCollected && styles.parcelCardCollected]}>
        <View style={styles.cardLeft}>
          <View style={[styles.iconCircle, { backgroundColor: isCollected ? '#F1F5F9' : '#FEF3C7' }]}>
            <Icon name="cube" size={24} color={isCollected ? '#94A3B8' : '#D97706'} />
          </View>
          <View style={styles.details}>
            <Text style={styles.parcelName}>{item.deliveryCompany} • {item.recipientName}</Text>
            <Text style={styles.parcelMeta}>{item.date} • {item.time}</Text>
            {!isCollected && (
              <View style={styles.codeBadge}>
                <Icon name="key" size={12} color="#D97706" />
                <Text style={styles.codeText}>Pickup Code: {item.pickupCode}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: isCollected ? '#E2E8F0' : '#D1FAE5' }]}>
          <Text style={[styles.statusText, { color: isCollected ? '#64748B' : '#059669' }]}>{item.status}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />

      {/* Blue theme header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Gate Deliveries</Text>
            <Text style={styles.headerSubtitle}>Parcels waiting at society gate</Text>
          </View>
        </View>
      </View>

      <View style={styles.mainArea}>
        {myParcels.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="cube-outline" size={60} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No parcels logged</Text>
            <Text style={styles.emptySub}>Any deliveries dropped at the main gate will show here.</Text>
          </View>
        ) : (
          <FlatList
            data={myParcels}
            renderItem={renderParcelItem}
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
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#475569', marginTop: 15 },
  emptySub: { fontSize: 14, color: '#94A3B8', textAlign: 'center', marginTop: 6 },

  parcelCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#F1F5F9', elevation: 3, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5 },
  parcelCardCollected: { opacity: 0.75, borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconCircle: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  details: { flex: 1 },
  parcelName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 },
  parcelMeta: { fontSize: 13, color: '#64748B', marginBottom: 6 },
  codeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  codeText: { color: '#B45309', fontSize: 12, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: 'bold' }
});

export default ResidentParcelsScreen;
