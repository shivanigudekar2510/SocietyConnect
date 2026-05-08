import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AddStaffScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Security Guard');
  const [shift, setShift] = useState('Morning');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveStaff = async () => {
    if (!name.trim() || !role.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing Fields", "Please complete all required fields.");
      return;
    }

    setLoading(true);

    try {
      const firestore = require('@react-native-firebase/firestore').default;
      const emailLower = email.trim().toLowerCase();

      // Check if email already exists
      const checkSnapshot = await firestore()
        .collection('users')
        .where('email', '==', emailLower)
        .get();

      if (!checkSnapshot.empty) {
        setLoading(false);
        Alert.alert("Error", "A staff member with this email already exists.");
        return;
      }

      await firestore().collection('users').add({
        name: name.trim(),
        role: 'guard',
        staffRole: role.trim(),
        shift: shift.trim(),
        email: emailLower,
        password: password.trim(),
      });

      setLoading(false);
      Alert.alert("Success", "Staff member added successfully!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      setLoading(false);
      console.log('ℹ️ Error adding staff to Firestore.', err);
      Alert.alert("Error", "Could not connect to database. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Staff / Guard</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Staff Name *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Ramesh Singh" 
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />
        
        <Text style={styles.label}>Role *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Security Guard" 
          placeholderTextColor="#9CA3AF"
          value={role}
          onChangeText={setRole}
        />

        <Text style={styles.label}>Shift (e.g. Morning, Evening)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Morning" 
          placeholderTextColor="#9CA3AF"
          value={shift}
          onChangeText={setShift}
        />

        <Text style={styles.label}>Email Address *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. guard@example.com" 
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter password" 
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <TouchableOpacity style={[styles.saveButton, loading && styles.saveButtonDisabled]} onPress={handleSaveStaff} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Save Staff</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  content: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 15, height: 50, color: '#111827' },
  saveButton: { backgroundColor: '#2563EB', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  saveButtonDisabled: { backgroundColor: '#93C5FD' },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});

export default AddStaffScreen;
