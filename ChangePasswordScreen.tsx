import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ChangePasswordScreen = ({ navigation }: any) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Current Password</Text>
        <View style={styles.inputContainer}>
          <Icon name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput 
            style={styles.input}
            secureTextEntry={!showPassword}
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholder="Enter current password"
          />
        </View>

        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputContainer}>
          <Icon name="key-outline" size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput 
            style={styles.input}
            secureTextEntry={!showPassword}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm New Password</Text>
        <View style={styles.inputContainer}>
          <Icon name="checkmark-circle-outline" size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput 
            style={styles.input}
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={() => navigation.goBack()}>
          <Text style={styles.saveButtonText}>Update Password</Text>
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
  label: { fontSize: 13, fontWeight: '600', color: '#4B5563', marginBottom: 8, marginTop: 15 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 15, height: 56,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#111827' },
  saveButton: {
    backgroundColor: '#2563EB', height: 56, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginTop: 40
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});

export default ChangePasswordScreen;
