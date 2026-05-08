import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const EditPhoneScreen = ({ navigation }: any) => {
  const [phone, setPhone] = useState('+91 98765 43210');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Phone</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Registered Phone Number</Text>
        <View style={styles.inputContainer}>
          <Icon name="call-outline" size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput 
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
        <Text style={styles.helperText}>An OTP will be sent to this number for verification.</Text>

        <TouchableOpacity style={styles.saveButton} onPress={() => navigation.goBack()}>
          <Text style={styles.saveButtonText}>Send OTP</Text>
        </TouchableOpacity>
      </View>
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
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 10 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 15, height: 56,
    marginBottom: 10
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#111827' },
  helperText: { fontSize: 13, color: '#6B7280', marginBottom: 30 },
  saveButton: {
    backgroundColor: '#2563EB', height: 56, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center'
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});

export default EditPhoneScreen;
