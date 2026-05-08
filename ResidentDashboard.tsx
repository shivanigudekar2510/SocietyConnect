import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar, Dimensions, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  PayBills: undefined;
  PreApprove: undefined;
  Notices: undefined;
  Services: undefined;
  Emergency: undefined;
  Directory: undefined;
  AmenitiesBooking: undefined;
  VisitorHistory: undefined;
  ManageDailyHelp: undefined;
  ResidentParcels: undefined;
};

const ResidentDashboard = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { walkIns, updateWalkInStatus, triggerSOS } = useAppContext();
  const pendingWalkIn = walkIns.find(w => w.flat === 'Flat 402' && w.status === 'Pending');

  const [maintenanceStatus, setMaintenanceStatus] = useState('Due in 4 days');

  useEffect(() => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      const unsubscribe = firestore()
        .collection('maintenance_payments')
        .where('flat', '==', 'Flat 402')
        .onSnapshot((snap: any) => {
          if (!snap) return;
          let latestStatus = 'Due in 4 days';
          snap.forEach((doc: any) => {
            const data = doc.data();
            if (data.status === 'Approved') {
              latestStatus = 'Paid';
            } else if (data.status === 'Pending' && latestStatus !== 'Paid') {
              latestStatus = 'Pending Approval';
            }
          });
          setMaintenanceStatus(latestStatus);
        });
      return unsubscribe;
    } catch (e) {
      console.log('Error checking maintenance status', e);
    }
  }, []);

  const handlePanicSOS = async () => {
    Alert.alert(
      "CONFIRM PANIC SOS 🚨",
      "This will immediately notify all security guards at the main gate and nearby residents. Do you want to continue?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "YES, Send Alert", 
          style: "destructive",
          onPress: async () => {
            triggerSOS('Flat 402');

            try {
              const firestore = require('@react-native-firebase/firestore').default;
              await firestore().collection('sos_alerts').add({
                flat: 'Flat 402',
                status: 'Active',
                timestamp: new Date().toISOString()
              });
            } catch (err) {
              console.log('Error triggering panic alert', err);
            }

            Alert.alert("SOS Sent", "Help is on the way. Guard has been alerted!");
          } 
        }
      ]
    );
  };

  const menuItems = [
    { id: '1', title: 'Pay Bills', icon: 'card', color: '#E3F2FD', route: 'PayBills' },
    { id: '2', title: 'Pre-approve', icon: 'person-add', color: '#F3E5F5', route: 'PreApprove' },
    { id: '3', title: 'Visitor History', icon: 'time', color: '#E8F5E9', route: 'VisitorHistory' },
    { id: '4', title: 'Gate Deliveries', icon: 'cube', color: '#FFF3E0', route: 'ResidentParcels' },
    { id: '5', title: 'Daily Helpers', icon: 'people', color: '#E0F7FA', route: 'ManageDailyHelp' },
    { id: '6', title: 'Services', icon: 'construct', color: '#FFEBEE', route: 'Services' },
    { id: '7', title: 'Amenities', icon: 'tennisball', color: '#FFF1F2', route: 'AmenitiesBooking' },
    { id: '8', title: 'Notices', icon: 'notifications', color: '#F3F4F6', route: 'Notices' },
  ];

  const renderItem = ({ item }: { item: typeof menuItems[0] }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => {
        if (item.route) {
          navigation.navigate(item.route as keyof RootStackParamList);
        }
      }}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Icon name={item.icon} size={26} color="#4B5563" />
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />
      
      <Modal visible={!!pendingWalkIn} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Icon name="warning" size={24} color="#F59E0B" />
              <Text style={styles.modalTitle}>Action Required</Text>
            </View>
            <Text style={styles.modalText}>
              <Text style={{ fontWeight: 'bold' }}>{pendingWalkIn?.name}</Text> is requesting entry for <Text style={{ fontWeight: 'bold' }}>{pendingWalkIn?.type}</Text>.
            </Text>
            {pendingWalkIn?.vehicle ? <Text style={styles.modalText}>Vehicle: {pendingWalkIn.vehicle}</Text> : null}
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#EF4444' }]} onPress={() => updateWalkInStatus(pendingWalkIn!.id, 'Denied')}>
                <Text style={styles.modalBtnText}>Deny</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#10B981' }]} onPress={() => updateWalkInStatus(pendingWalkIn!.id, 'Approved')}>
                <Text style={styles.modalBtnText}>Approve</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Curved Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Hello, Flat 402 👋</Text>
            <Text style={styles.subText}>Green Valley Heights</Text>
          </View>

          {/* Panic / SOS Alert Section */}
          <TouchableOpacity style={styles.sosCircle} onPress={handlePanicSOS}>
            <Icon name="alert-circle" size={22} color="#FFFFFF" />
            <Text style={styles.sosText}>Panic</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Highlighted/Floating Bill Summary */}
      <View style={styles.statusCard}>
        <View>
          <Text style={styles.statusLabel}>Next Maintenance</Text>
          <Text style={[styles.statusValue, maintenanceStatus === 'Paid' && { color: '#10B981' }, maintenanceStatus === 'Pending Approval' && { color: '#F59E0B' }]}>
            {maintenanceStatus}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.payButton, (maintenanceStatus === 'Paid' || maintenanceStatus === 'Pending Approval') && { backgroundColor: '#E5E7EB' }]}
          onPress={() => navigation.navigate('PayBills')}
          disabled={maintenanceStatus === 'Paid' || maintenanceStatus === 'Pending Approval'}
        >
          <Text style={[styles.payButtonText, (maintenanceStatus === 'Paid' || maintenanceStatus === 'Pending Approval') && { color: '#6B7280' }]}>
            {maintenanceStatus === 'Paid' ? 'Paid' : maintenanceStatus === 'Pending Approval' ? 'Pending' : 'Pay Now'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Menu Options Grid */}
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { 
    backgroundColor: '#1E3A8A', height: 180, borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, paddingHorizontal: 25, paddingTop: 20
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcomeText: { fontSize: 24, color: 'white', fontWeight: 'bold', letterSpacing: 0.5 },
  subText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4 },
  sosCircle: { backgroundColor: '#EF4444', flexDirection: 'row', gap: 4, alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, elevation: 4 },
  sosText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  statusCard: { 
    backgroundColor: 'white', marginHorizontal: 25, marginTop: -40, borderRadius: 20, 
    padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10
  },
  statusLabel: { color: '#6B7280', fontSize: 12, marginBottom: 4 },
  statusValue: { color: '#111827', fontSize: 18, fontWeight: 'bold' },
  payButton: { backgroundColor: '#10B981', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12 },
  payButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  gridContainer: { padding: 20, paddingTop: 30, paddingBottom: 110 },
  row: { justifyContent: 'space-between' },
  card: { 
    backgroundColor: 'white', width: (width - 60) / 2, marginBottom: 20, borderRadius: 20, 
    padding: 20, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5
  },
  iconContainer: { width: 55, height: 55, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  cardTitle: { color: '#374151', fontWeight: '600', fontSize: 14, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 20, elevation: 10 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  modalText: { fontSize: 16, color: '#4B5563', marginBottom: 10, lineHeight: 24 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 15 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  modalBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default ResidentDashboard;