import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  SafeAreaView, StatusBar, Linking, Alert 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const EmergencyScreen = ({ navigation }: any) => {
  const [isSosActive, setIsSosActive] = useState(false);

  // Function to trigger SOS
  const handleSOS = () => {
    Alert.alert(
      "Trigger SOS?",
      "This will immediately alert the Main Gate Security and your registered emergency contacts.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "SOUND ALARM", 
          style: "destructive",
          onPress: () => {
            setIsSosActive(true);
            // In a real app, this would hit your backend to send FCM push notifications/SMS
            setTimeout(() => {
              Alert.alert("SOS Sent", "Security is on the way to Flat 402.");
              setIsSosActive(false);
            }, 2000);
          }
        }
      ]
    );
  };

  // Function to open the phone dialer
  const makeCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch((err) => 
      console.error('Error opening dialer:', err)
    );
  };

  const emergencyContacts = [
    { id: '1', label: 'Main Gate Security', number: '+91-9876543210', icon: 'shield-checkmark', color: '#1E3A8A' },
    { id: '2', label: 'National Emergency', number: '112', icon: 'alert', color: '#DC2626' },
    { id: '3', label: 'Police', number: '100', icon: 'car-sport', color: '#2563EB' },
    { id: '4', label: 'Ambulance', number: '108', icon: 'medkit', color: '#10B981' },
    { id: '5', label: 'Fire Brigade', number: '101', icon: 'flame', color: '#D97706' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency & SOS</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Giant SOS Button Area */}
        <View style={styles.sosContainer}>
          <TouchableOpacity 
            style={[styles.sosButton, isSosActive && styles.sosButtonActive]}
            onPress={handleSOS}
            activeOpacity={0.7}
          >
            <View style={styles.sosInnerCircle}>
              <Text style={styles.sosText}>{isSosActive ? "SENDING..." : "SOS"}</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.sosSubtext}>Tap and confirm to alert security instantly</Text>
        </View>

        {/* Quick Call Directory */}
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        
        <View style={styles.contactList}>
          {emergencyContacts.map((contact) => (
            <TouchableOpacity 
              key={contact.id} 
              style={styles.contactCard}
              onPress={() => makeCall(contact.number)}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${contact.color}15` }]}>
                <Icon name={contact.icon} size={24} color={contact.color} />
              </View>
              <View style={styles.contactDetails}>
                <Text style={styles.contactLabel}>{contact.label}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
              </View>
              <View style={styles.callButton}>
                <Icon name="call" size={18} color="#2563EB" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
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

  scrollContent: { padding: 20, paddingBottom: 110 },

  sosContainer: { 
    alignItems: 'center', 
    marginTop: 20,
    marginBottom: 40 
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FEE2E2', // Light red outer ring
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 15,
    shadowColor: '#DC2626',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 }
  },
  sosButtonActive: {
    transform: [{ scale: 0.95 }],
    backgroundColor: '#FECACA'
  },
  sosInnerCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#DC2626', // Deep red inner circle
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF'
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 2
  },
  sosSubtext: {
    marginTop: 20,
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500'
  },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 15 },
  
  contactList: { gap: 12 },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  contactDetails: { flex: 1 },
  contactLabel: { fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 4 },
  contactNumber: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  
  callButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
});

export default EmergencyScreen;