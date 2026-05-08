import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, FlatList, 
  SafeAreaView, StatusBar, TextInput, Dimensions, Alert 
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useAppContext, WalkIn } from '../context/AppContext';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const GuardDashboard = ({ navigation }: any) => {
  const { logout } = useAuth();
  const { walkIns, sosAlerts, resolveSOS } = useAppContext();
  const [passCode, setPassCode] = useState('');

  const activeSOS = sosAlerts.find(s => s.status === 'Active');

  const handleVerifyPass = () => {
    if (!passCode.trim()) return;
    
    // Simulate verifying a pass created by the Resident in PreApproveScreen
    Alert.alert(
      "Pass Verified ✅",
      `Guest for Flat 402 is approved.\nCode: ${passCode.toUpperCase()}`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Allow Entry", 
          onPress: () => {
            setPassCode('');
            Alert.alert("Success", "Gate opened.");
          } 
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "End shift and log out of the terminal?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: logout }
    ]);
  };

  const quickActions = [
    { id: '1', label: 'Delivery', icon: 'cube', color: '#E0F2FE', textColor: '#0284C7' },
    { id: '2', label: 'Cab', icon: 'car', color: '#FEF3C7', textColor: '#D97706' },
    { id: '3', label: 'Guest', icon: 'person', color: '#F3E5F5', textColor: '#9333EA' },
    { id: '4', label: 'Service', icon: 'hammer', color: '#E1AFD1', textColor: '#A21CAF' },
  ];

  const renderLogItem = ({ item }: { item: WalkIn }) => {
    let statusColor = '#6B7280';
    if (item.status === 'Approved') statusColor = '#10B981';
    if (item.status === 'Denied') statusColor = '#EF4444';
    if (item.status === 'Pending') statusColor = '#F59E0B';

    const iconName = item.type === 'Delivery' ? 'cube' : item.type === 'Cab' ? 'car' : item.type === 'Service' ? 'hammer' : 'person';

    return (
      <View style={styles.logCard}>
        <View style={styles.logIconContainer}>
          <Icon name={iconName} size={22} color="#4B5563" />
        </View>
        <View style={styles.logDetails}>
          <Text style={styles.logName}>{item.name}</Text>
          <Text style={styles.logMeta}>{item.flat} • {item.time}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusIndicator, { color: statusColor }]}>●</Text>
          <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
      
      {/* Guard Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Main Gate Terminal</Text>
            <Text style={styles.subText}>Shift: Morning • Guard: Ramesh</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Icon name="log-out" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* EMERGENCY SOS BANNER */}
      {activeSOS && (
        <View style={styles.sosAlertBanner}>
          <Icon name="alert-circle" size={26} color="#FFFFFF" />
          <View style={styles.sosAlertContent}>
            <Text style={styles.sosAlertTitle}>CRITICAL SOS: {activeSOS.flat}</Text>
            <Text style={styles.sosAlertSub}>Triggered at {activeSOS.time}. Dispatching help!</Text>
          </View>
          <TouchableOpacity 
            style={styles.sosResolveBtn}
            onPress={() => {
              resolveSOS(activeSOS.id);
              Alert.alert('SOS Resolved', 'Crisis successfully managed.');
            }}
          >
            <Text style={styles.sosResolveText}>Resolve</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Floating Verification Card */}
      <View style={styles.verifyCard}>
        <Text style={styles.cardTitle}>Verify Pre-Approved Pass</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.codeInput}
            placeholder="Enter 6-digit Code"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="characters"
            maxLength={6}
            value={passCode}
            onChangeText={setPassCode}
          />
          <TouchableOpacity 
            style={[styles.verifyButton, !passCode && styles.verifyButtonDisabled]}
            onPress={handleVerifyPass}
            disabled={!passCode}
          >
            <Text style={styles.verifyButtonText}>Check</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Entry Actions */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>New Walk-in Entry</Text>
        <View style={styles.quickActionGrid}>
          {quickActions.map(action => (
            <TouchableOpacity key={action.id} style={styles.actionPill} onPress={() => navigation.navigate('WalkInEntry', { type: action.label })}>
              <View style={[styles.actionIconCircle, { backgroundColor: action.color }]}>
                <Icon name={action.icon} size={24} color={action.textColor} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Premium Added Features for Guard */}
      <View style={styles.sectionContainer}>
        <View style={styles.secondaryActionsGrid}>
          <TouchableOpacity style={styles.secondaryActionCard} onPress={() => navigation.navigate('GuardParcels')}>
            <View style={[styles.secondaryActionIcon, { backgroundColor: '#FFFBEB' }]}>
              <Icon name="cube" size={22} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.secondaryActionTitle}>Parcel Management</Text>
              <Text style={styles.secondaryActionSub}>Gate pickups & drops</Text>
            </View>
            <Icon name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryActionCard} onPress={() => navigation.navigate('GuardDailyHelp')}>
            <View style={[styles.secondaryActionIcon, { backgroundColor: '#F0FDF4' }]}>
              <Icon name="people" size={22} color="#15803D" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.secondaryActionTitle}>Daily Helpers</Text>
              <Text style={styles.secondaryActionSub}>Helper check-in & check-out</Text>
            </View>
            <Icon name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryActionCard} onPress={() => navigation.navigate('VehicleSearch')}>
            <View style={[styles.secondaryActionIcon, { backgroundColor: '#EFF6FF' }]}>
              <Icon name="search" size={22} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.secondaryActionTitle}>Vehicle Search</Text>
              <Text style={styles.secondaryActionSub}>Check parking authorization</Text>
            </View>
            <Icon name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Live Logs List */}
      <View style={[styles.sectionContainer, { flex: 1, paddingBottom: 110 }]}>
        <View style={styles.logHeaderRow}>
          <Text style={styles.sectionTitle}>Live Logs</Text>
        </View>
        
        <FlatList
          data={walkIns}
          renderItem={renderLogItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 }}
        />
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  
  header: { 
    backgroundColor: '#1F2937', 
    height: 160, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    paddingHorizontal: 25,
    paddingTop: 20
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcomeText: { fontSize: 22, color: 'white', fontWeight: 'bold', letterSpacing: 0.5 },
  subText: { color: '#9CA3AF', fontSize: 14, marginTop: 4 },
  logoutButton: { 
    width: 45, height: 45, borderRadius: 22.5, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    justifyContent: 'center', alignItems: 'center' 
  },

  sosAlertBanner: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 14,
    gap: 12,
    elevation: 4
  },
  sosAlertContent: { flex: 1 },
  sosAlertTitle: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  sosAlertSub: { color: '#FECACA', fontSize: 12, marginTop: 2 },
  sosResolveBtn: { backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  sosResolveText: { color: '#DC2626', fontWeight: 'bold', fontSize: 12 },
  
  verifyCard: { 
    backgroundColor: 'white', 
    marginHorizontal: 20, 
    marginTop: -40, 
    borderRadius: 20, 
    padding: 20, 
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10
  },
  cardTitle: { color: '#374151', fontSize: 14, fontWeight: 'bold', marginBottom: 12 },
  inputRow: { flexDirection: 'row', gap: 10 },
  codeInput: {
    flex: 1, height: 50, backgroundColor: '#F9FAFB', 
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, 
    paddingHorizontal: 15, fontSize: 16, fontWeight: '600', color: '#111827',
    textTransform: 'uppercase'
  },
  verifyButton: { 
    backgroundColor: '#10B981', justifyContent: 'center', 
    alignItems: 'center', paddingHorizontal: 20, borderRadius: 12 
  },
  verifyButtonDisabled: { backgroundColor: '#A7F3D0' },
  verifyButtonText: { color: 'white', fontWeight: 'bold', fontSize: 15 },

  sectionContainer: { paddingHorizontal: 20, marginTop: 22 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  
  quickActionGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  actionPill: { alignItems: 'center', width: (width - 60) / 4 },
  actionIconCircle: { 
    width: 54, height: 54, borderRadius: 27, 
    justifyContent: 'center', alignItems: 'center', marginBottom: 8 
  },
  actionLabel: { fontSize: 12, fontWeight: '600', color: '#4B5563' },

  secondaryActionsGrid: { gap: 10 },
  secondaryActionCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.04
  },
  secondaryActionIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  secondaryActionTitle: { fontSize: 14, fontWeight: 'bold', color: '#111827', marginBottom: 2 },
  secondaryActionSub: { fontSize: 12, color: '#6B7280' },

  logHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },

  logCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    padding: 15, borderRadius: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  logIconContainer: {
    width: 46, height: 46, borderRadius: 12, backgroundColor: '#F3F4F6',
    justifyContent: 'center', alignItems: 'center', marginRight: 15
  },
  logDetails: { flex: 1 },
  logName: { fontSize: 15, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  logMeta: { fontSize: 13, color: '#6B7280' },
  statusContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  statusIndicator: { fontSize: 12, marginRight: 4 },
  statusText: { fontSize: 12, fontWeight: 'bold' }
});

export default GuardDashboard;