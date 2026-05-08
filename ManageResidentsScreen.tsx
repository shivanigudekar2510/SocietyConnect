import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

interface Resident {
  id: string;
  name: string;
  flat: string;
  type: string;
  email: string;
  phone: string;
}

const ManageResidentsScreen = ({ navigation }: any) => {
  const { userRole } = useAuth();
  const rawRole = userRole ? String(userRole).toLowerCase().trim() : '';
  const isSecretary = rawRole === 'secretary' || rawRole === 'admin';

  const [residents, setResidents] = useState<Resident[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchResidents = async () => {
    setLoading(true);
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      const querySnapshot = await firestore().collection('users').get();
      const residentDocs: Resident[] = [];

      querySnapshot.forEach((doc: any) => {
        const data = doc.data();
        const role = String(data.role || '').toLowerCase().trim();

        if (role === 'resident' || role === 'owner' || role === 'tenant') {
          residentDocs.push({
            id: doc.id,
            name: data.name || 'Anonymous User',
            flat: data.flat || 'N/A',
            type: data.role || 'Resident',
            email: data.email || '',
            phone: data.phone || ''
          });
        }
      });

      setResidents(residentDocs);
    } catch (err) {
      console.log('ℹ️ Error fetching residents from Firestore.', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const deleteResident = async (id: string, name: string) => {
    Alert.alert(
      "Delete Resident",
      `Are you sure you want to delete ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const firestore = require('@react-native-firebase/firestore').default;
              await firestore().collection('users').doc(id).delete();
              Alert.alert("Success", "Resident deleted successfully!");
              fetchResidents();
            } catch (err) {
              Alert.alert("Error", "Could not delete resident from database.");
            }
          }
        }
      ]
    );
  };

  const filteredResidents = residents.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.flat.toLowerCase().includes(search.toLowerCase())
  );

  const renderResident = ({ item }: { item: Resident }) => (
    <View style={styles.card}>
      <View style={styles.avatarContainer}>
        <Icon name="person" size={24} color="#4F46E5" />
      </View>
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.badgeRow}>
          <Text style={styles.flatText}>{item.flat}</Text>
          <View style={[styles.typeBadge, item.type.toLowerCase() === 'owner' ? styles.ownerBadge : styles.tenantBadge]}>
            <Text style={[styles.typeText, item.type.toLowerCase() === 'owner' ? styles.ownerText : styles.tenantText]}>{item.type}</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.moreButton} onPress={() => Alert.alert('Resident Details', `Email: ${item.email}\nPhone: ${item.phone}`)}>
          <Icon name="information-circle" size={22} color="#4F46E5" />
        </TouchableOpacity>
        {isSecretary && (
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteResident(item.id, item.name)}>
            <Icon name="trash-outline" size={22} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#312E81" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Residents</Text>
        {isSecretary ? (
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddResident')}>
            <Icon name="add" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or flat..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />
          </View>
        ) : (
          <FlatList
            data={filteredResidents}
            renderItem={renderResident}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 110 }}
            refreshing={loading}
            onRefresh={fetchResidents}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#312E81'
  },
  backButton: { 
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', 
    justifyContent: 'center', alignItems: 'center'
  },
  addButton: { 
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#4F46E5', 
    justifyContent: 'center', alignItems: 'center'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  content: { flex: 1, padding: 20 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    paddingHorizontal: 15, paddingVertical: 5, borderRadius: 12, marginBottom: 20,
    borderWidth: 1, borderColor: '#E5E7EB'
  },
  searchInput: { flex: 1, height: 48, fontSize: 15, color: '#111827' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    padding: 15, borderRadius: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#F3F4F6', elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3
  },
  avatarContainer: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: '#EEF2FF',
    justifyContent: 'center', alignItems: 'center', marginRight: 15
  },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 6 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  flatText: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  ownerBadge: { backgroundColor: '#ECFCCB' },
  ownerText: { color: '#65A30D', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  tenantBadge: { backgroundColor: '#E0E7FF' },
  tenantText: { color: '#4F46E5', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  typeText: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  moreButton: { padding: 5 },
  deleteButton: { padding: 5 }
});

export default ManageResidentsScreen;
