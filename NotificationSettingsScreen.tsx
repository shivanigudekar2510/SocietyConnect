import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NotificationSettingsScreen = ({ navigation }: any) => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(true);

  const SettingToggle = ({ icon, title, description, value, onValueChange }: any) => (
    <View style={styles.settingCard}>
      <View style={styles.settingIcon}>
        <Icon name={icon} size={24} color="#4B5563" />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDesc}>{description}</Text>
      </View>
      <Switch 
        value={value} 
        onValueChange={onValueChange} 
        trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Notification Preferences</Text>
        
        <SettingToggle 
          icon="notifications-outline" 
          title="Push Notifications" 
          description="Receive alerts on your device."
          value={pushEnabled}
          onValueChange={setPushEnabled}
        />
        <SettingToggle 
          icon="mail-outline" 
          title="Email Notifications" 
          description="Receive daily summaries and bills."
          value={emailEnabled}
          onValueChange={setEmailEnabled}
        />
        <SettingToggle 
          icon="chatbubble-outline" 
          title="SMS Alerts" 
          description="Critical alerts and OTPs."
          value={smsEnabled}
          onValueChange={setSmsEnabled}
        />
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
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', marginBottom: 15, marginLeft: 4 },
  settingCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    padding: 16, borderRadius: 16, marginBottom: 12,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4
  },
  settingIcon: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3F4F6',
    justifyContent: 'center', alignItems: 'center', marginRight: 15
  },
  settingTextContainer: { flex: 1 },
  settingTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  settingDesc: { fontSize: 13, color: '#6B7280' }
});

export default NotificationSettingsScreen;
