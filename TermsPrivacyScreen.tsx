import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const TermsPrivacyScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Privacy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.date}>Last updated: May 01, 2026</Text>
        
        <Text style={styles.paragraph}>
          Welcome to Society Connect! By using our app, you agree to comply with our community guidelines and the terms listed below. This platform is provided to help facilitate smooth communication and management between the residents, guards, and the society committee.
        </Text>

        <Text style={styles.heading}>1. Account Responsibilities</Text>
        <Text style={styles.paragraph}>
          You are responsible for maintaining the confidentiality of your login credentials. Any activity under your account, including generating visitor passes or booking amenities, is your sole responsibility.
        </Text>

        <Text style={styles.heading}>2. Community Guidelines</Text>
        <Text style={styles.paragraph}>
          Users must behave respectfully towards all neighbors, staff, and committee members on the platform. Abuse or misuse of features like Emergency SOS or Helpdesk ticketing may result in temporary suspension of app privileges.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.paragraph}>
          Your privacy is important to us. Society Connect only collects information necessary to provide you with secure access to your premises and community services.
        </Text>

        <Text style={styles.heading}>Data We Collect</Text>
        <Text style={styles.paragraph}>
          • Basic profile information (Name, Flat Number, Contact Details){'\n'}
          • Vehicle and pet registries{'\n'}
          • Visitor logs linked to your flat{'\n'}
          • Service request history
        </Text>

        <Text style={styles.heading}>How We Use Your Data</Text>
        <Text style={styles.paragraph}>
          Your data is used strictly for authentication, generating visitor passes, processing service requests, and sending community broadcast notices. Your personal phone number is masked from security guards and other residents by default.
        </Text>

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
  content: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 5 },
  date: { fontSize: 13, color: '#9CA3AF', marginBottom: 20 },
  heading: { fontSize: 16, fontWeight: 'bold', color: '#374151', marginTop: 20, marginBottom: 8 },
  paragraph: { fontSize: 15, color: '#4B5563', lineHeight: 24, marginBottom: 10 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 30 }
});

export default TermsPrivacyScreen;
