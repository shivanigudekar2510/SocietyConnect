import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  SafeAreaView, StatusBar, Dimensions, Alert 
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

// Define shapes for our mock data
interface ActionItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'Approval' | 'Alert' | 'Finance';
  time: string;
  isPayment?: boolean;
}

const SecretaryDashboard = ({ navigation }: any) => {
  const { logout } = useAuth();
  const [pendingPayments, setPendingPayments] = useState<ActionItem[]>([]);

  // Mock data for the executive view
  const stats = {
    collection: '₹4.2L',
    pendingDues: '₹85K',
    openTickets: 12,
    activeVisitors: 8,
  };

  const [actionItems, setActionItems] = useState<ActionItem[]>([
    { id: '1', title: 'New Tenant Approval', subtitle: 'Flat 602 - A. Sharma', type: 'Approval', time: '1h ago' },
    { id: '2', title: 'Water Tank Maintenance', subtitle: 'Invoice #4421 pending', type: 'Finance', time: '3h ago' },
    { id: '3', title: 'Elevator B Malfunction', subtitle: 'Multiple complaints received', type: 'Alert', time: '5h ago' },
  ]);

  useEffect(() => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      const unsubscribe = firestore()
        .collection('maintenance_payments')
        .where('status', '==', 'Pending')
        .onSnapshot((snap: any) => {
          if (!snap) return;
          const docs: ActionItem[] = [];
          snap.forEach((doc: any) => {
            const data = doc.data();
            docs.push({
              id: doc.id,
              title: `Maintenance: ${data.flat}`,
              subtitle: `₹${data.amount} pending approval`,
              type: 'Approval',
              time: data.date || 'Today',
              isPayment: true
            });
          });
          setPendingPayments(docs);
        });
      return unsubscribe;
    } catch (e) {
      console.log('Error listening to maintenance payments', e);
    }
  }, []);

  const handleLogout = () => {
    Alert.alert("Log Out", "Exit the Admin Portal?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: logout }
    ]);
  };

  const adminActions = [
    { id: '1', label: 'Broadcast Notice', icon: 'megaphone', color: '#FEF2F2', textColor: '#DC2626', route: 'BroadcastNotice' },
    { id: '2', label: 'Financials', icon: 'stats-chart', color: '#ECFCCB', textColor: '#65A30D', route: 'Financials' },
    { id: '3', label: 'Manage Staff', icon: 'people', color: '#E0E7FF', textColor: '#4F46E5', route: 'ManageStaff' },
    { id: '4', label: 'Helpdesk', icon: 'hammer', color: '#FFEDD5', textColor: '#EA580C', route: 'AdminHelpdesk' },
    { id: '5', label: 'Residents', icon: 'home', color: '#E0F2FE', textColor: '#0284C7', route: 'ManageResidents' },
    { id: '6', label: 'Helpers', icon: 'hand-left', color: '#FDF4FF', textColor: '#C026D3', route: 'ManageDailyHelp' },
    { id: '7', label: 'Community', icon: 'chatbubbles', color: '#E0F2FE', textColor: '#2563EB', route: 'Community' },
  ];

  const allActionItems = [...pendingPayments, ...actionItems];

  const renderActionItem = (item: ActionItem) => {
    let typeColor = '#6B7280';
    let typeBg = '#F3F4F6';
    
    if (item.type === 'Approval') { typeColor = '#2563EB'; typeBg = '#EFF6FF'; }
    if (item.type === 'Alert') { typeColor = '#DC2626'; typeBg = '#FEF2F2'; }
    if (item.type === 'Finance') { typeColor = '#059669'; typeBg = '#D1FAE5'; }

    const handleNavigation = () => {
      if (item.isPayment) {
        Alert.alert(
          "Approve Payment",
          `${item.title}\n${item.subtitle}`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Deny",
              style: "destructive",
              onPress: async () => {
                const firestore = require('@react-native-firebase/firestore').default;
                await firestore().collection('maintenance_payments').doc(item.id).update({ status: 'Denied' });
              }
            },
            {
              text: "Approve",
              onPress: async () => {
                const firestore = require('@react-native-firebase/firestore').default;
                await firestore().collection('maintenance_payments').doc(item.id).update({ status: 'Approved' });
              }
            }
          ]
        );
        return;
      }
      if (item.type === 'Approval') navigation.navigate('ManageResidents');
      if (item.type === 'Finance') navigation.navigate('Financials');
      if (item.type === 'Alert') navigation.navigate('AdminHelpdesk');
    };

    return (
      <TouchableOpacity key={item.id} style={styles.actionCard} onPress={handleNavigation}>
        <View style={styles.actionDetails}>
          <View style={styles.titleRow}>
            <View style={[styles.typeBadge, { backgroundColor: typeBg }]}>
              <Text style={[styles.typeText, { color: typeColor }]}>{item.type}</Text>
            </View>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          <Text style={styles.actionTitle}>{item.title}</Text>
          <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
        </View>
        <TouchableOpacity style={styles.resolveButton} onPress={handleNavigation}>
          <Text style={styles.resolveIcon}>›</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#312E81" />
      
      {/* Executive Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Admin Portal</Text>
            <Text style={styles.subText}>Welcome, Committee Secretary</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Icon name="log-out" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Key Metrics Floating Card */}
        <View style={styles.metricsCard}>
          <Text style={styles.sectionTitle}>Monthly Overview</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{stats.collection}</Text>
              <Text style={styles.metricLabel}>Collected</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: '#DC2626' }]}>{stats.pendingDues}</Text>
              <Text style={styles.metricLabel}>Pending Dues</Text>
            </View>
          </View>
          <View style={styles.horizontalDivider} />
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{stats.openTickets}</Text>
              <Text style={styles.metricLabel}>Open Tickets</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{stats.activeVisitors}</Text>
              <Text style={styles.metricLabel}>Active Visitors</Text>
            </View>
          </View>
        </View>

        {/* Admin Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Management Tools</Text>
          <View style={styles.quickActionGrid}>
            {adminActions.map(action => (
              <TouchableOpacity key={action.id} style={styles.actionPill} onPress={() => navigation.navigate(action.route)}>
                <View style={[styles.actionIconCircle, { backgroundColor: action.color }]}>
                  <Icon name={action.icon} size={24} color={action.textColor} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Items List */}
        <View style={styles.sectionContainer}>
          <View style={styles.listHeaderRow}>
            <Text style={styles.sectionTitle}>Needs Attention</Text>
            <View style={styles.badgeCount}>
              <Text style={styles.badgeText}>{allActionItems.length}</Text>
            </View>
          </View>
          
          <View style={styles.actionList}>
            {allActionItems.map(renderActionItem)}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { 
    backgroundColor: '#312E81',
    height: 180, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    paddingHorizontal: 25,
    paddingTop: 20
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcomeText: { fontSize: 24, color: 'white', fontWeight: 'bold', letterSpacing: 0.5 },
  subText: { color: '#C7D2FE', fontSize: 14, marginTop: 4 },
  logoutButton: { 
    width: 45, height: 45, borderRadius: 22.5, 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    justifyContent: 'center', alignItems: 'center' 
  },
  scrollContent: { paddingBottom: 110 },
  metricsCard: { 
    backgroundColor: 'white', 
    marginHorizontal: 20, 
    marginTop: -50, 
    borderRadius: 20, 
    padding: 20, 
    elevation: 8,
    shadowColor: '#312E81',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10
  },
  metricsGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  metricItem: { flex: 1, alignItems: 'center' },
  metricValue: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  metricLabel: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  verticalDivider: { width: 1, backgroundColor: '#F3F4F6', marginHorizontal: 15 },
  horizontalDivider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 5 },
  sectionContainer: { paddingHorizontal: 20, marginTop: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 15 },
  quickActionGrid: { flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', gap: 15 },
  actionPill: { alignItems: 'center', width: (width - 70) / 4, marginBottom: 15 },
  actionIconCircle: { 
    width: 56, height: 56, borderRadius: 20, 
    justifyContent: 'center', alignItems: 'center', marginBottom: 8 
  },
  actionLabel: { fontSize: 12, fontWeight: '600', color: '#4B5563', textAlign: 'center' },
  listHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  badgeCount: { 
    backgroundColor: '#EF4444', 
    borderRadius: 12, 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    marginLeft: 10,
    marginTop: -12
  },
  badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  actionList: { gap: 12 },
  actionCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    padding: 16, borderRadius: 16,
    borderWidth: 1, borderColor: '#F3F4F6',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4
  },
  actionDetails: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  timeText: { fontSize: 12, color: '#9CA3AF' },
  actionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  actionSubtitle: { fontSize: 14, color: '#6B7280' },
  resolveButton: { padding: 10 },
  resolveIcon: { fontSize: 24, color: '#9CA3AF' }
});

export default SecretaryDashboard;