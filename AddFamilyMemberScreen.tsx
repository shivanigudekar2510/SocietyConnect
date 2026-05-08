import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AddFamilyMemberScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [age, setAge] = useState('');

  const handleAddMember = async () => {
    if (!name.trim() || !relation.trim() || !age.trim()) {
      Alert.alert("Required", "Please fill out all fields.");
      return;
    }

    try {
      const firestore = require('@react-native-firebase/firestore').default;
      await firestore().collection('family_members').add({
        name: name.trim(),
        relation: relation.trim(),
        age: age.trim(),
        flat: 'Flat 402',
        timestamp: new Date().toISOString()
      });

      Alert.alert(
        "Success", 
        "Family member added successfully!", 
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      console.log('Error adding family member', err);
      Alert.alert("Error", "Could not add family member.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Family Member</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Member Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Priya Sharma" 
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />
        
        <Text style={styles.label}>Relationship</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Spouse" 
          placeholderTextColor="#9CA3AF"
          value={relation}
          onChangeText={setRelation}
        />

        <Text style={styles.label}>Age (Yrs)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. 32" 
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />
        
        <TouchableOpacity style={styles.saveButton} onPress={handleAddMember}>
          <Text style={styles.saveButtonText}>Add Member</Text>
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
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 15, height: 50, color: '#111827', fontSize: 15, marginBottom: 5 },
  saveButton: { backgroundColor: '#2563EB', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});

export default AddFamilyMemberScreen;
