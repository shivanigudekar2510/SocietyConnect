import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, 
  ScrollView, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PreApproveScreen = ({ navigation }: any) => {
  const [visitorType, setVisitorType] = useState('Guest');
  const [arrivalTime, setArrivalTime] = useState('Next 1 Hour');

  const [visitorName, setVisitorName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  
  const visitorCategories = [
    { id: '1', label: 'Guest', icon: 'person' },
    { id: '2', label: 'Delivery', icon: 'cube' },
    { id: '3', label: 'Cab', icon: 'car' },
    { id: '4', label: 'Service', icon: 'hammer' },
  ];

  const timeSlots = ['Next 30 Mins', 'Next 1 Hour', 'Today', 'Tomorrow'];

  const handleCreatePass = async () => {
    if (!visitorName.trim()) {
      Alert.alert('Required', 'Please enter a visitor name.');
      return;
    }

    try {
      const docData: any = {
        type: visitorType,
        name: visitorName.trim(),
        flat: 'Flat 402',
        status: 'Approved',
        time: arrivalTime,
        timestamp: new Date().toISOString()
      };

      if (vehicleNumber.trim()) {
        docData.vehicle = vehicleNumber.trim();
      }
      if (phoneNumber.trim()) {
        docData.phoneNumber = phoneNumber.trim();
      }

      const firestore = require('@react-native-firebase/firestore').default;
      await firestore().collection('walk_ins').add(docData);

      Alert.alert(
        "Pass Created 🎉",
        `Entry pass generated successfully for ${visitorName}!`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      console.log('Error creating pass', err);
      Alert.alert('Error', 'Could not save pass to database.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pre-Approve Entry</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Visitor Type Selector */}
          <Text style={styles.sectionLabel}>Who is visiting?</Text>
          <View style={styles.categoryRow}>
            {visitorCategories.map((cat) => (
              <TouchableOpacity 
                key={cat.id} 
                style={[styles.categoryCard, visitorType === cat.label && styles.categoryCardActive]}
                onPress={() => setVisitorType(cat.label)}
              >
                <Icon name={cat.icon} size={24} color={visitorType === cat.label ? '#2563EB' : '#6B7280'} style={styles.categoryIcon} />
                <Text style={[styles.categoryText, visitorType === cat.label && styles.categoryTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Form Inputs */}
          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>Visitor Name (Required)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g., Rahul Sharma or Amazon" 
              placeholderTextColor="#9CA3AF"
              value={visitorName}
              onChangeText={setVisitorName}
            />

            <Text style={styles.inputLabel}>Phone Number (Optional)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter 10-digit number" 
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              maxLength={10}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />

            {visitorType === 'Cab' && (
              <>
                <Text style={styles.inputLabel}>Vehicle Number (Optional)</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g., MH 09 AB 1234" 
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="characters"
                  value={vehicleNumber}
                  onChangeText={setVehicleNumber}
                />
              </>
            )}
          </View>

          {/* Expected Time Selector */}
          <Text style={styles.sectionLabel}>Expected Arrival</Text>
          <View style={styles.timePillContainer}>
            {timeSlots.map((time) => (
              <TouchableOpacity 
                key={time}
                style={[styles.timePill, arrivalTime === time && styles.timePillActive]}
                onPress={() => setArrivalTime(time)}
              >
                <Text style={[styles.timePillText, arrivalTime === time && styles.timePillTextActive]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>Pass Type</Text>
          <Text style={styles.summaryValue}>{visitorType} • {arrivalTime}</Text>
        </View>
        <TouchableOpacity style={styles.generateButton} onPress={handleCreatePass}>
          <Text style={styles.generateButtonText}>Create Pass</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15 
  },
  backButton: { 
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', 
    justifyContent: 'center', alignItems: 'center',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  scrollContent: { padding: 20, paddingBottom: 160 },
  sectionLabel: { fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 15, marginTop: 10 },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  categoryCard: { 
    flex: 1, 
    backgroundColor: '#FFFFFF', 
    marginHorizontal: 4, 
    paddingVertical: 15, 
    borderRadius: 16, 
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  categoryCardActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  categoryIcon: { marginBottom: 8 },
  categoryText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  categoryTextActive: { color: '#2563EB' },
  formSection: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20, marginBottom: 25, elevation: 2, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 8 },
  input: { 
    height: 50, 
    backgroundColor: '#F3F4F6', 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    fontSize: 16, 
    color: '#111827',
    marginBottom: 20 
  },
  timePillContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timePill: { 
    backgroundColor: '#FFFFFF', 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  timePillActive: { backgroundColor: '#111827', borderColor: '#111827' },
  timePillText: { fontSize: 14, fontWeight: '500', color: '#4B5563' },
  timePillTextActive: { color: '#FFFFFF' },
  bottomBar: { 
    position: 'absolute', bottom: 75, left: 0, right: 0, 
    backgroundColor: '#FFFFFF', 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 25, paddingVertical: 15, 
    borderTopWidth: 1, borderTopColor: '#F3F4F6',
    elevation: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10
  },
  summaryContainer: { flex: 1 },
  summaryLabel: { color: '#6B7280', fontSize: 12, marginBottom: 2 },
  summaryValue: { color: '#111827', fontSize: 15, fontWeight: 'bold' },
  generateButton: { backgroundColor: '#10B981', paddingVertical: 14, paddingHorizontal: 25, borderRadius: 12 },
  generateButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});

export default PreApproveScreen;