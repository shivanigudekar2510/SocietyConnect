import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, Alert, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BroadcastNoticeScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);

  const handleBroadcast = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Required', 'Please enter a title and description.');
      return;
    }

    try {
      const firestore = require('@react-native-firebase/firestore').default;
      await firestore().collection('notices').add({
        title: title.trim(),
        description: description.trim(),
        isEmergency,
        date: new Date().toLocaleDateString(),
        timestamp: new Date().toISOString()
      });

      Alert.alert(
        isEmergency ? 'Critical Alert Broadcasted 🚨' : 'Notice Sent 📢',
        isEmergency 
          ? 'Your emergency alert has been instantly broadcasted to all residents.' 
          : 'Your notice has been broadcasted to all residents.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      console.log('Error broadcasting notice', err);
      Alert.alert('Error', 'Could not save notice to Firestore. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEmergency ? 'Emergency Broadcast' : 'Broadcast Notice'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.content}>
          <Text style={styles.label}>Notice Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Water Supply Interruption"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Write your notice details here..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>Mark as Emergency Alert</Text>
              <Text style={styles.switchDesc}>Pins notice at the top with a red accent</Text>
            </View>
            <Switch 
              value={isEmergency}
              onValueChange={setIsEmergency}
              trackColor={{ false: '#D1D5DB', true: '#EF4444' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, isEmergency && styles.emergencySubmit]} 
            onPress={handleBroadcast}
          >
            <Text style={styles.submitButtonText}>
              {isEmergency ? 'Broadcast Critical Alert' : 'Send Notice'}
            </Text>
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
  textArea: {
    backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB',
    padding: 15, fontSize: 16, color: '#111827', minHeight: 150
  },
  submitButton: { 
    backgroundColor: '#2563EB', paddingVertical: 15, borderRadius: 12, 
    alignItems: 'center', marginTop: 30,
    elevation: 2, shadowColor: '#2563EB', shadowOpacity: 0.3, shadowRadius: 5
  },
  emergencySubmit: { backgroundColor: '#EF4444', shadowColor: '#EF4444' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25, backgroundColor: '#FFFFFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  switchLabel: { fontSize: 15, fontWeight: 'bold', color: '#111827' },
  switchDesc: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});

export default BroadcastNoticeScreen;
