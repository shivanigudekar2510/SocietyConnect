import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MyVehiclesScreen = ({ navigation }: any) => {
  const [vehicles, setVehicles] = useState<any[]>([
    { id: '1', type: 'Car', name: 'Honda City', plate: 'MH 12 AB 1234', color: '#10B981' },
    { id: '2', type: 'Bike', name: 'Royal Enfield', plate: 'MH 12 XY 9876', color: '#F59E0B' },
  ]);

  useEffect(() => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      const unsubscribe = firestore()
        .collection('vehicles')
        .where('flat', '==', 'Flat 402')
        .onSnapshot((snap: any) => {
          if (!snap) return;
          const docs: any[] = [];
          snap.forEach((doc: any) => {
            const data = doc.data();
            docs.push({
              id: doc.id,
              type: data.type || 'Car',
              name: data.type || 'Vehicle',
              plate: data.plate,
              color: (data.type || '').toLowerCase().includes('bike') ? '#F59E0B' : '#10B981'
            });
          });
          if (docs.length > 0) {
            setVehicles(docs);
          }
        });
      return unsubscribe;
    } catch (e) {
      console.log('Error fetching vehicles from Firestore', e);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Vehicles</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={vehicles}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Icon name={(item.type || '').toLowerCase().includes('bike') ? 'bicycle' : 'car'} size={24} color={item.color || '#10B981'} />
            </View>
            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.plate}>{item.plate}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Verified</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No vehicles found.</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddVehicle')}>
        <Icon name="add" size={30} color="#FFFFFF" />
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
  listContainer: { padding: 20, paddingBottom: 100 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    padding: 16, borderRadius: 16, marginBottom: 15,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5
  },
  iconContainer: {
    width: 50, height: 50, borderRadius: 12, backgroundColor: '#F3F4F6',
    justifyContent: 'center', alignItems: 'center', marginRight: 15
  },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  plate: { fontSize: 14, color: '#6B7280', fontWeight: '600' },
  badge: { backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#059669', fontSize: 12, fontWeight: 'bold' },
  fab: { 
    position: 'absolute', bottom: 30, right: 20,
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#2563EB', 
    justifyContent: 'center', alignItems: 'center',
    elevation: 8, shadowColor: '#2563EB', shadowOpacity: 0.3, shadowRadius: 8
  },
  emptyState: { padding: 20, alignItems: 'center' },
  emptyText: { color: '#6B7280', fontSize: 16 }
});

export default MyVehiclesScreen;
