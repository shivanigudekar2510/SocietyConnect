import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  SafeAreaView, StatusBar, Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileScreen = ({ navigation }: any) => {
  const { logout, userEmail, userRole } = useAuth();
  const rawRole = userRole ? String(userRole).toLowerCase().trim() : 'resident';
  const isResident = rawRole === 'resident' || rawRole === 'owner' || rawRole === 'tenant';
  const isGuard = rawRole === 'guard';
  const isSecretary = rawRole === 'secretary' || rawRole === 'admin';

  const [role, setRole] = useState<'Owner' | 'Tenant'>('Owner');
  const [userData, setUserData] = useState({
    name: 'Rahul Sharma',
    flat: 'Flat 402',
    phone: '+91 98765 43210',
    email: userEmail || 'rahul.s@example.com'
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userEmail) return;

      try {
        const firestore = require('@react-native-firebase/firestore').default;
        const querySnapshot = await firestore()
          .collection('users')
          .where('email', '==', userEmail)
          .get();

        if (!querySnapshot.empty) {
          const fbUser = querySnapshot.docs[0].data();
          setUserData({
            name: fbUser.name || 'Rahul Sharma',
            flat: fbUser.flat || 'Flat 402',
            phone: fbUser.phone || '+91 98765 43210',
            email: fbUser.email || userEmail
          });
        }
      } catch (err) {
        console.log('ℹ️ Error fetching profile data from firestore.', err);
      }
    };

    fetchUserData();
  }, [userEmail]);

  const handleRoleToggle = () => {
    setRole(prev => prev === 'Owner' ? 'Tenant' : 'Owner');
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out of Society Connect?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => logout()
        }
      ]
    );
  };

  const SettingsItem = ({ icon, title, value, isDestructive = false, onPress }: any) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        <View style={[styles.iconContainer, isDestructive && { backgroundColor: '#FEE2E2' }]}>
          <Icon name={icon} size={18} color={isDestructive ? '#DC2626' : '#6B7280'} />
        </View>
        <Text style={[styles.itemTitle, isDestructive && { color: '#DC2626' }]}>{title}</Text>
      </View>
      <View style={styles.settingsItemRight}>
        {value && <Text style={styles.itemValue}>{value}</Text>}
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  );

  const renderResidentProfile = () => (
    <>
      {/* Profile Info Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{userData.name.charAt(0)}</Text>
        </View>
        <View style={styles.profileDetails}>
          <Text style={styles.profileName}>{userData.name}</Text>
          <TouchableOpacity onPress={handleRoleToggle} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={styles.profileFlat}>{userData.flat} • {role}  </Text>
            <Icon name="swap-horizontal" size={16} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Verified Resident ✓</Text>
          </View>
        </View>
      </View>

      {/* Household Section */}
      <Text style={styles.sectionTitle}>My Household</Text>
      <View style={styles.cardSection}>
        <SettingsItem icon="people" title="Family Members" value="3 Members" onPress={() => navigation.navigate('FamilyMembers')} />
        <View style={styles.divider} />
        <SettingsItem icon="car" title="My Vehicles" value="1 Car, 1 Bike" onPress={() => navigation.navigate('MyVehicles')} />
        <View style={styles.divider} />
        <SettingsItem icon="paw" title="Pets" value="None" onPress={() => navigation.navigate('Pets')} />
      </View>

      {/* Account Details Section */}
      <Text style={styles.sectionTitle}>Account Details</Text>
      <View style={styles.cardSection}>
        <SettingsItem icon="call" title="Phone Number" value={userData.phone} onPress={() => navigation.navigate('EditPhone')} />
        <View style={styles.divider} />
        <SettingsItem icon="mail" title="Email Address" value={userData.email} onPress={() => navigation.navigate('EditEmail')} />
        <View style={styles.divider} />
        <SettingsItem icon="lock-closed" title="Change Password" onPress={() => navigation.navigate('ChangePassword')} />
      </View>

      {/* App Settings Section */}
      <Text style={styles.sectionTitle}>App Settings</Text>
      <View style={styles.cardSection}>
        <SettingsItem icon="notifications" title="Notifications" value="Enabled" onPress={() => navigation.navigate('NotificationSettings')} />
        <View style={styles.divider} />
        <SettingsItem icon="globe" title="Language" value="English" onPress={() => navigation.navigate('Language')} />
        <View style={styles.divider} />
        <SettingsItem icon="document-text" title="Terms & Privacy" onPress={() => navigation.navigate('TermsPrivacy')} />
      </View>
    </>
  );

  const renderGuardProfile = () => (
    <>
      {/* Guard Profile Card */}
      <View style={[styles.profileCard, { backgroundColor: '#0D9488' }]}>
        <View style={styles.avatarCircle}>
          <Text style={[styles.avatarText, { color: '#0D9488' }]}>{userData.name.charAt(0)}</Text>
        </View>
        <View style={styles.profileDetails}>
          <Text style={styles.profileName}>{userData.name}</Text>
          <Text style={styles.profileFlat}>Society Security Guard</Text>
          <View style={[styles.badge, { backgroundColor: '#10B981' }]}>
            <Text style={styles.badgeText}>Verified Security ✓</Text>
          </View>
        </View>
      </View>

      {/* Security Actions Section */}
      <Text style={styles.sectionTitle}>Duty Operations</Text>
      <View style={styles.cardSection}>
        <SettingsItem icon="shield-checkmark" title="View Shift Duty & Schedule" value="Morning Shift" onPress={() => Alert.alert("Shift Info", "Current Shift: 08:00 AM - 04:00 PM")} />
        <View style={styles.divider} />
        <SettingsItem icon="document-text" title="Daily Gate Logs" onPress={() => Alert.alert("Logs", "Total logs entered today: 24 visitors")} />
        <View style={styles.divider} />
        <SettingsItem icon="alert-circle" title="Emergency SOS List" onPress={() => Alert.alert("Emergency Contacts", "Police: 100\nAmbulance: 108")} />
      </View>

      {/* Account Details Section */}
      <Text style={styles.sectionTitle}>Account Details</Text>
      <View style={styles.cardSection}>
        <SettingsItem icon="call" title="Phone Number" value={userData.phone} onPress={() => navigation.navigate('EditPhone')} />
        <View style={styles.divider} />
        <SettingsItem icon="mail" title="Email Address" value={userData.email} onPress={() => navigation.navigate('EditEmail')} />
        <View style={styles.divider} />
        <SettingsItem icon="lock-closed" title="Change Password" onPress={() => navigation.navigate('ChangePassword')} />
      </View>
    </>
  );

  const renderSecretaryProfile = () => (
    <>
      {/* Secretary Profile Card */}
      <View style={[styles.profileCard, { backgroundColor: '#312E81' }]}>
        <View style={styles.avatarCircle}>
          <Text style={[styles.avatarText, { color: '#312E81' }]}>{userData.name.charAt(0)}</Text>
        </View>
        <View style={styles.profileDetails}>
          <Text style={styles.profileName}>{userData.name}</Text>
          <Text style={styles.profileFlat}>Management Committee Secretary</Text>
          <View style={[styles.badge, { backgroundColor: '#4F46E5' }]}>
            <Text style={styles.badgeText}>Verified Administrator ✓</Text>
          </View>
        </View>
      </View>

      {/* Society Management Section */}
      <Text style={styles.sectionTitle}>Society Admin Tools</Text>
      <View style={styles.cardSection}>
        <SettingsItem icon="megaphone" title="Broadcast Notices" onPress={() => navigation.navigate('BroadcastNotice')} />
        <View style={styles.divider} />
        <SettingsItem icon="people" title="Manage Staff & Guards" onPress={() => navigation.navigate('ManageStaff')} />
        <View style={styles.divider} />
        <SettingsItem icon="home" title="Manage Residents" onPress={() => navigation.navigate('ManageResidents')} />
        <View style={styles.divider} />
        <SettingsItem icon="hand-left" title="Manage Daily Helpers" onPress={() => navigation.navigate('ManageDailyHelp')} />
      </View>

      {/* Account Details Section */}
      <Text style={styles.sectionTitle}>Account Details</Text>
      <View style={styles.cardSection}>
        <SettingsItem icon="call" title="Phone Number" value={userData.phone} onPress={() => navigation.navigate('EditPhone')} />
        <View style={styles.divider} />
        <SettingsItem icon="mail" title="Email Address" value={userData.email} onPress={() => navigation.navigate('EditEmail')} />
        <View style={styles.divider} />
        <SettingsItem icon="lock-closed" title="Change Password" onPress={() => navigation.navigate('ChangePassword')} />
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isResident && renderResidentProfile()}
        {isGuard && renderGuardProfile()}
        {isSecretary && renderSecretaryProfile()}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Icon name="log-out" size={18} color="#DC2626" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.appVersion}>Society Connect v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#111827' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 110 },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }
  },
  avatarCircle: {
    width: 66, height: 66, borderRadius: 33,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 18
  },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#1E3A8A' },
  profileDetails: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  profileFlat: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 12, marginLeft: 4 },

  cardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  settingsItemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 12
  },
  itemTitle: { fontSize: 15, fontWeight: '500', color: '#111827' },

  settingsItemRight: { flexDirection: 'row', alignItems: 'center' },
  itemValue: { fontSize: 14, color: '#6B7280', marginRight: 10 },
  chevron: { fontSize: 20, color: '#D1D5DB', marginTop: -2 },

  divider: { height: 1, backgroundColor: '#F3F4F6' },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 20
  },
  logoutIcon: { marginRight: 8 },
  logoutText: { color: '#DC2626', fontSize: 16, fontWeight: 'bold' },

  appVersion: { textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginBottom: 20 }
});

export default ProfileScreen;