import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

interface StaffItem {
  id: string;
  name: string;
  role: string;
  shift: string;
  email?: string;
}

const ManageStaffScreen = ({ navigation }: any) => {
  const { userRole } = useAuth();
  const rawRole = userRole ? String(userRole).toLowerCase().trim() : '';
  const isSecretary = rawRole === 'secretary' || rawRole === 'admin';

  const [staff, setStaff] = useState<StaffItem[]>([
    { id: '1', name: 'Ramesh Singh', role: 'Security Guard', shift: 'Morning' },
    { id: '2', name: 'Kamlesh', role: 'Plumber', shift: 'On Call' },
    { id: '3', name: 'Anita', role: 'Cleaner', shift: 'Morning' },
  ]);
  const [loading, setLoading] = useState(false);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      const querySnapshot = await firestore().collection('users').get();
      const firestoreStaff: StaffItem[] = [];

      querySnapshot.forEach((doc: any) => {
        const data = doc.data();
        const role = String(data.role || '').toLowerCase().trim();

        if (role === 'guard' || role === 'staff') {
          firestoreStaff.push({
            id: doc.id,
            name: data.name || 'Anonymous User',
            role: data.staffRole || data.role || 'Security Guard',
            shift: data.shift || 'General',
            email: data.email || ''
          });
        }
      });

      // Avoid duplicates from hardcoded ones by filtering matching names
      setStaff(prev => {
        const initial = prev.filter(item => item.id === '1' || item.id === '2' || item.id === '3');
        const uniqueFirestore = firestoreStaff.filter(fs => !initial.some(init => init.name.toLowerCase() === fs.name.toLowerCase()));
        return [...initial, ...uniqueFirestore];
      });
    } catch (err) {
      console.log('ℹ️ Error fetching staff from Firestore.', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleDeleteStaff = async (id: string, name: string) => {
    if (id === '1' || id === '2' || id === '3') {
      Alert.alert("Notice", "Mock data staff members cannot be removed.");
      return;
    }

    Alert.alert(
      "Delete Staff Member",
      `Are you sure you want to remove ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const firestore = require('@react-native-firebase/firestore').default;
              await firestore().collection('users').doc(id).delete();
              Alert.alert("Success", "Staff member removed successfully!");
              
              // update screen state
              setStaff(prev => prev.filter(s => s.id !== id));
            } catch (err) {
              Alert.alert("Error", "Could not remove staff member from database.");
            }
          }
        }
      ]
    );
  };

  const renderStaff = ({ item }: { item: StaffItem }) => (
    <View style={styles.staffCard}>
      <View style={styles.staffIcon}>
        <Icon name="person" size={24} color="#4F46E5" />
      </View>
      <View style={styles.staffDetails}>
        <Text style={styles.staffName}>{item.name}</Text>
        <Text style={styles.staffRole}>{item.role} • {item.shift}</Text>
        {item.email && <Text style={styles.staffEmail}>{item.email}</Text>}
      </View>
      {isSecretary && (
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleDeleteStaff(item.id, item.name)}>
          <Icon name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Manage Staff</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={staff}
          renderItem={renderStaff}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onRefresh={fetchStaff}
          refreshing={loading}
        />
      )}

      {isSecretary && (
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddStaff')}>
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
  listContent: { padding: 20, paddingBottom: 150 },
  staffCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    padding: 16, borderRadius: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#F3F4F6'
  },
  staffIcon: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#E0E7FF',
    justifyContent: 'center', alignItems: 'center', marginRight: 15
  },
  staffDetails: { flex: 1 },
  staffName: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  staffRole: { fontSize: 13, color: '#6B7280' },
  staffEmail: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  actionBtn: { padding: 5 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fab: {
    position: 'absolute', bottom: 90, right: 20,
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#4F46E5',
    justifyContent: 'center', alignItems: 'center',
    elevation: 5, shadowColor: '#4F46E5', shadowOpacity: 0.3, shadowRadius: 8
  }
});

export default ManageStaffScreen;
