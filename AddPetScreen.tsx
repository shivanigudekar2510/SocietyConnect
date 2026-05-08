import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AddPetScreen = ({ navigation }: any) => {
  const [petName, setPetName] = useState('');
  const [breed, setBreed] = useState('');

  const handleAddPet = async () => {
    if (!petName.trim() || !breed.trim()) {
      Alert.alert("Required", "Please fill in all fields.");
      return;
    }

    try {
      const firestore = require('@react-native-firebase/firestore').default;
      await firestore().collection('pets').add({
        name: petName.trim(),
        breed: breed.trim(),
        flat: 'Flat 402',
        timestamp: new Date().toISOString()
      });

      Alert.alert(
        "Success", 
        "Pet added successfully!", 
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      console.log('Error adding pet', err);
      Alert.alert("Error", "Could not add pet.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Pet</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Pet Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Bella" 
          placeholderTextColor="#9CA3AF"
          value={petName}
          onChangeText={setPetName}
        />
        
        <Text style={styles.label}>Type & Breed</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Dog (Golden Retriever)" 
          placeholderTextColor="#9CA3AF"
          value={breed}
          onChangeText={setBreed}
        />
        
        <TouchableOpacity style={styles.saveButton} onPress={handleAddPet}>
          <Text style={styles.saveButtonText}>Add Pet</Text>
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
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 15, height: 50, color: '#111827', fontSize: 15 },
  saveButton: { backgroundColor: '#2563EB', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});

export default AddPetScreen;
