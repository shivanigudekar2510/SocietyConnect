import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AddVehicleScreen = ({ navigation }: any) => {
  const [vehicleType, setVehicleType] = useState('');
  const [plate, setPlate] = useState('');

  const handleAddVehicle = async () => {
    if (!vehicleType.trim() || !plate.trim()) {
      Alert.alert("Required", "Please fill in all fields.");
      return;
    }

    try {
      const firestore = require('@react-native-firebase/firestore').default;
      await firestore().collection('vehicles').add({
        type: vehicleType.trim(),
        plate: plate.trim().toUpperCase(),
        flat: 'Flat 402',
        timestamp: new Date().toISOString()
      });

      Alert.alert(
        "Success", 
        "Vehicle added successfully!", 
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      console.log('Error adding vehicle', err);
      Alert.alert("Error", "Could not add vehicle.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Vehicle</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Vehicle Type</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Car / Bike" 
          placeholderTextColor="#9CA3AF"
          value={vehicleType}
          onChangeText={setVehicleType}
        />
        
        <Text style={styles.label}>License Plate</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. MH 12 AB 1234" 
          placeholderTextColor="#9CA3AF"
          autoCapitalize="characters"
          value={plate}
          onChangeText={setPlate}
        />
        
        <TouchableOpacity style={styles.saveButton} onPress={handleAddVehicle}>
          <Text style={styles.saveButtonText}>Add Vehicle</Text>
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

export default AddVehicleScreen;
