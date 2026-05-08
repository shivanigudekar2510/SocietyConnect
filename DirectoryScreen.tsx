import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, FlatList, 
  SafeAreaView, StatusBar, TextInput, Linking 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Define the shape of a Directory Contact
interface Contact {
  id: string;
  name: string;
  role: string;
  category: 'Committee' | 'Maintenance' | 'Neighbors';
  phone: string;
  unit?: string; // e.g., Flat number for neighbors
}

const DirectoryScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'Committee' | 'Maintenance' | 'Neighbors'>('Maintenance');

  // Mock data for the directory
  const contacts: Contact[] = [
    { id: '1', name: 'Ramesh Kumar', role: 'Society Chairman', category: 'Committee', phone: '+919876543210', unit: 'A-101' },
    { id: '2', name: 'Anita Desai', role: 'Treasurer', category: 'Committee', phone: '+919876543211', unit: 'B-405' },
    { id: '3', name: 'Suresh Electrician', role: 'Head Electrician', category: 'Maintenance', phone: '+919876543212' },
    { id: '4', name: 'Raju Plumber', role: 'Society Plumber', category: 'Maintenance', phone: '+919876543213' },
    { id: '5', name: 'Deepak Lift Mechanic', role: 'Elevator Support', category: 'Maintenance', phone: '+919876543214' },
    { id: '6', name: 'Vikram Singh', role: 'Resident', category: 'Neighbors', phone: '+919876543215', unit: 'Flat 401' },
    { id: '7', name: 'Priya Sharma', role: 'Resident', category: 'Neighbors', phone: '+919876543216', unit: 'Flat 403' },
  ];

  // Filter contacts based on search query and active tab
  const filteredContacts = contacts.filter(contact => {
    const matchesCategory = contact.category === activeCategory;
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          contact.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const makeCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(err => console.error('Error opening dialer', err));
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <View style={styles.contactCard}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactRole}>
          {item.role} {item.unit ? `• ${item.unit}` : ''}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.callButton}
        onPress={() => makeCall(item.phone)}
      >
        <Icon name="call" size={18} color="#111827" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Directory</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={16} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or role..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Tabs */}
      <View style={styles.tabContainer}>
        {(['Maintenance', 'Committee', 'Neighbors'] as const).map((category) => (
          <TouchableOpacity 
            key={category}
            style={[styles.tabPill, activeCategory === category && styles.activeTabPill]}
            onPress={() => setActiveCategory(category)}
          >
            <Text style={[styles.tabText, activeCategory === category && styles.activeTabText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contact List */}
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="file-tray" size={40} color="#6B7280" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No contacts found.</Text>
          </View>
        }
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

  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 50, fontSize: 16, color: '#111827' },

  tabContainer: { 
    flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10, gap: 10 
  },
  tabPill: { 
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, 
    backgroundColor: '#E5E7EB' 
  },
  activeTabPill: { backgroundColor: '#2563EB' },
  tabText: { color: '#4B5563', fontSize: 13, fontWeight: '600' },
  activeTabText: { color: '#FFFFFF' },

  listContainer: { padding: 20, paddingBottom: 100 },
  
  contactCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 1,
    shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 3
  },
  avatarContainer: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 15
  },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: '#2563EB' },
  
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 2 },
  contactRole: { fontSize: 13, color: '#6B7280' },
  
  callButton: {
    width: 45, height: 45, borderRadius: 22.5,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center', alignItems: 'center',
    marginLeft: 10
  },
});

export default DirectoryScreen;