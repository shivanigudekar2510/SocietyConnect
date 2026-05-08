import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AddResidentScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [flat, setFlat] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('Resident');
  const [loading, setLoading] = useState(false);

  const handleAddResident = async () => {
    if (!name.trim() || !flat.trim() || !email.trim() || !password.trim()) {
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
        Alert.alert("Error", "A resident with this email already exists.");
        return;
      }

      // Add to users collection in Firestore
      await firestore().collection('users').add({
        name: name.trim(),
        flat: flat.trim(),
        email: emailLower,
        password: password.trim(),
        phone: phone.trim(),
        role: type.trim() || 'Resident'
      });

      setLoading(false);
      Alert.alert("Success", "Resident added successfully!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      setLoading(false);
      console.log('ℹ️ Error adding resident to Firestore.', err);
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
        <Text style={styles.headerTitle}>Add Resident</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Resident Name *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Anand Kumar" 
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />
        
        <Text style={styles.label}>Flat Number *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. A-101" 
          placeholderTextColor="#9CA3AF"
          value={flat}
          onChangeText={setFlat}
        />

        <Text style={styles.label}>Email Address *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. anand@example.com" 
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter login password" 
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. +91 98765 43210" 
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Resident Type</Text>
        <View style={styles.typeSelector}>
          {['Resident', 'Owner', 'Tenant'].map(item => (
            <TouchableOpacity 
              key={item} 
              style={[styles.typeBtn, type === item && styles.typeBtnActive]} 
              onPress={() => setType(item)}
            >
              <Text style={[styles.typeBtnText, type === item && styles.typeBtnTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity style={[styles.saveButton, loading && styles.saveButtonDisabled]} onPress={handleAddResident} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Add Resident</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  content: { padding: 20, paddingBottom: 50 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 15, height: 50, color: '#111827' },
  typeSelector: { flexDirection: 'row', gap: 10, marginTop: 5 },
  typeBtn: { flex: 1, height: 46, borderRadius: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
  typeBtnActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  typeBtnText: { color: '#4B5563', fontWeight: 'bold', fontSize: 13 },
  typeBtnTextActive: { color: '#FFFFFF' },
  saveButton: { backgroundColor: '#2563EB', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  saveButtonDisabled: { backgroundColor: '#93C5FD' },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});

export default AddResidentScreen;
