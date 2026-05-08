import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FamilyMembersScreen = ({ navigation }: any) => {
  const [members, setMembers] = useState<any[]>([
    { id: '1', name: 'Rahul Sharma', relation: 'Self', age: '34' },
    { id: '2', name: 'Priya Sharma', relation: 'Spouse', age: '32' },
    { id: '3', name: 'Aarav Sharma', relation: 'Son', age: '8' },
  ]);

  useEffect(() => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      const unsubscribe = firestore()
        .collection('family_members')
        .where('flat', '==', 'Flat 402')
        .onSnapshot((snap: any) => {
          if (!snap) return;
          const docs: any[] = [];
          snap.forEach((doc: any) => docs.push({ id: doc.id, ...doc.data() }));
          if (docs.length > 0) {
            setMembers(docs);
          }
        });
      return unsubscribe;
    } catch (e) {
      console.log('Error fetching family members from Firestore', e);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Family Members</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={members}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.memberCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name ? item.name.charAt(0) : 'M'}</Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.relation}>{item.relation} • {item.age} yrs</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No family members found.</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddFamilyMember')}>
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
  memberCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    padding: 15, borderRadius: 16, marginBottom: 15,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5
  },
  avatar: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#EFF6FF',
    justifyContent: 'center', alignItems: 'center', marginRight: 15
  },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: '#2563EB' },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  relation: { fontSize: 14, color: '#6B7280' },
  fab: { 
    position: 'absolute', bottom: 30, right: 20,
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#2563EB', 
    justifyContent: 'center', alignItems: 'center',
    elevation: 8, shadowColor: '#2563EB', shadowOpacity: 0.3, shadowRadius: 8
  },
  emptyState: { padding: 20, alignItems: 'center' },
  emptyText: { color: '#6B7280', fontSize: 16 }
});

export default FamilyMembersScreen;
