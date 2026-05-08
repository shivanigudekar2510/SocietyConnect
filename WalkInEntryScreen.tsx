import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppContext } from '../context/AppContext';

const WalkInEntryScreen = ({ route, navigation }: any) => {
  const { type } = route.params || { type: 'Entry' };
  const { addWalkIn } = useAppContext();
  const [name, setName] = useState('');
  const [flat, setFlat] = useState('');
  const [vehicle, setVehicle] = useState('');

  const handleGrantEntry = () => {
    if (!name.trim() || !flat.trim()) {
      Alert.alert('Required', 'Please fill out the required fields.');
      return;
    }
    addWalkIn({ type, name, flat, vehicle, status: 'Pending' });
    Alert.alert(
      'Entry Logged ⏳',
      `Approval request sent to resident of ${flat}.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{type} Entry</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.content}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Suresh Kumar"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Flat Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Flat 402"
            placeholderTextColor="#9CA3AF"
            value={flat}
            onChangeText={setFlat}
          />

          {type === 'Cab' && (
            <>
              <Text style={styles.label}>Vehicle Number</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. MH12 AB 1234"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="characters"
                value={vehicle}
                onChangeText={setVehicle}
              />
            </>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleGrantEntry}>
            <Text style={styles.submitButtonText}>Grant Entry</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  content: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#4B5563', marginBottom: 8, marginTop: 15 },
  input: {
    backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB',
    paddingHorizontal: 15, height: 50, fontSize: 16, color: '#111827'
  },
  submitButton: { 
    backgroundColor: '#10B981', paddingVertical: 15, borderRadius: 12, 
    alignItems: 'center', marginTop: 40,
    elevation: 2, shadowColor: '#10B981', shadowOpacity: 0.3, shadowRadius: 5
  },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});

export default WalkInEntryScreen;
