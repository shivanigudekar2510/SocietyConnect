import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PetsScreen = ({ navigation }: any) => {
  const [pets, setPets] = useState<any[]>([]);

  useEffect(() => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      const unsubscribe = firestore()
        .collection('pets')
        .where('flat', '==', 'Flat 402')
        .onSnapshot((snap: any) => {
          if (!snap) return;
          const docs: any[] = [];
          snap.forEach((doc: any) => docs.push({ id: doc.id, ...doc.data() }));
          setPets(docs);
        });
      return unsubscribe;
    } catch (e) {
      console.log('Error fetching pets from Firestore', e);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pets</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.iconCircle}>
              <Icon name="paw" size={40} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>No Pets Added</Text>
            <Text style={styles.emptySubtitle}>You haven't added any pets to your household yet.</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddPet')}>
              <Text style={styles.addButtonText}>Add a Pet</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.petCard}>
            <View style={styles.avatar}>
              <Icon name="paw" size={24} color="#2563EB" />
            </View>
            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.breed}>{item.breed}</Text>
            </View>
          </View>
        )}
      />

      {pets.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddPet')}>
          <Icon name="add" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      )}
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
  listContainer: { padding: 20, flexGrow: 1 },
  petCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    padding: 15, borderRadius: 16, marginBottom: 15,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5
  },
  avatar: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#EFF6FF',
    justifyContent: 'center', alignItems: 'center', marginRight: 15
  },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  breed: { fontSize: 14, color: '#6B7280' },
  emptyState: { alignItems: 'center', paddingHorizontal: 20, marginTop: 100 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#F3F4F6',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20
  },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 30, lineHeight: 20 },
  addButton: { 
    backgroundColor: '#2563EB', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 12 
  },
  addButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  fab: { 
    position: 'absolute', bottom: 30, right: 20,
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#2563EB', 
    justifyContent: 'center', alignItems: 'center',
    elevation: 8, shadowColor: '#2563EB', shadowOpacity: 0.3, shadowRadius: 8
  }
});

export default PetsScreen;
