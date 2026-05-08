import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PayBillsScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);

  const billDetails = [
    { id: '1', label: 'Base Maintenance', amount: 3500 },
    { id: '2', label: 'Water Charges', amount: 450 },
    { id: '3', label: 'Sinking Fund', amount: 500 },
    { id: '4', label: 'Late Fees', amount: 0 },
  ];

  const totalAmount = billDetails.reduce((sum, item) => sum + item.amount, 0);

  useEffect(() => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      const unsubscribe = firestore()
        .collection('maintenance_payments')
        .where('flat', '==', 'Flat 402')
        .onSnapshot((snap: any) => {
          if (!snap) return;
          const docs: any[] = [];
          snap.forEach((doc: any) => docs.push({ id: doc.id, ...doc.data() }));
          setPaymentHistory(docs);
        });
      return unsubscribe;
    } catch (e) {
      console.log('Error loading payment history from Firestore', e);
    }
  }, []);

  const handleProceedToPay = async () => {
    const upiUrl = `upi://pay?pa=societyconnect@upi&pn=SocietyConnect&am=${totalAmount}&cu=INR&tn=Maintenance%20Bill`;
    Linking.canOpenURL(upiUrl)
      .then(async (supported) => {
        if (supported) {
          Linking.openURL(upiUrl);
        } else {
          Alert.alert(
            "Payment",
            "Payment initialized. Choose an action to simulate completion:",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Complete Payment",
                onPress: async () => {
                  try {
                    const firestore = require('@react-native-firebase/firestore').default;
                    await firestore().collection('maintenance_payments').add({
                      flat: 'Flat 402',
                      amount: totalAmount,
                      status: 'Pending',
                      date: new Date().toLocaleDateString(),
                      timestamp: new Date().toISOString(),
                      description: 'Maintenance Bill'
                    });
                    Alert.alert(
                      "Payment Registered",
                      "Your payment has been logged and is pending secretary approval. Once approved, it will move to your payment history."
                    );
                  } catch (err) {
                    console.log('Error recording payment', err);
                    Alert.alert("Error", "Could not submit payment record to database.");
                  }
                }
              }
            ]
          );
        }
      })
      .catch((err) => console.error('Error opening UPI link', err));
  };

  const pendingPayments = paymentHistory.filter(p => p.status === 'Pending');
  const approvedPayments = paymentHistory.filter(p => p.status === 'Approved');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Maintenance Bill</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Custom Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'current' && styles.activeTab]}
          onPress={() => setActiveTab('current')}
        >
          <Text style={[styles.tabText, activeTab === 'current' && styles.activeTabText]}>Current Bill</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'current' ? (
          <>
            {/* Amount Due Card */}
            <View style={styles.dueCard}>
              <Text style={styles.dueLabel}>Total Amount Due</Text>
              <Text style={styles.dueAmount}>₹{totalAmount.toLocaleString('en-IN')}</Text>
              <View style={styles.dueDateBadge}>
                <Text style={styles.dueDateText}>Due: 05 May, 2026</Text>
              </View>
            </View>

            {/* Bill Breakdown */}
            <Text style={styles.sectionTitle}>Bill Breakdown</Text>
            <View style={styles.breakdownContainer}>
              {billDetails.map((item) => (
                <View key={item.id} style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>{item.label}</Text>
                  <Text style={styles.breakdownValue}>₹{item.amount}</Text>
                </View>
              ))}
              <View style={styles.divider} />
              <View style={styles.breakdownRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{totalAmount}</Text>
              </View>
            </View>

            {/* Any Pending Payments Display */}
            {pendingPayments.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Pending Approvals ({pendingPayments.length})</Text>
                {pendingPayments.map((item) => (
                  <View key={item.id} style={[styles.txCard, styles.pendingTxCard]}>
                    <View style={styles.txLeft}>
                      <Icon name="time" size={24} color="#F59E0B" />
                      <View style={styles.txDetails}>
                        <Text style={styles.txDesc}>{item.description || 'Payment'}</Text>
                        <Text style={styles.txDate}>{item.date}</Text>
                      </View>
                    </View>
                    <Text style={[styles.txAmount, { color: '#F59E0B' }]}>₹{item.amount}</Text>
                  </View>
                ))}
              </>
            )}
          </>
        ) : (
          /* History Tab */
          <View style={styles.historySection}>
            {approvedPayments.length > 0 ? (
              approvedPayments.map((item) => (
                <View key={item.id} style={styles.txCard}>
                  <View style={styles.txLeft}>
                    <Icon name="checkmark-circle" size={24} color="#10B981" />
                    <View style={styles.txDetails}>
                      <Text style={styles.txDesc}>{item.description || 'Payment'}</Text>
                      <Text style={styles.txDate}>{item.date}</Text>
                    </View>
                  </View>
                  <Text style={styles.txAmount}>₹{item.amount}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Icon name="document-text" size={40} color="#6B7280" style={styles.emptyIcon} />
                <Text style={styles.emptyText}>No past transactions found.</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      {activeTab === 'current' && (
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.bottomBarLabel}>Total Due</Text>
            <Text style={styles.bottomBarAmount}>₹{totalAmount.toLocaleString('en-IN')}</Text>
          </View>
          <TouchableOpacity style={styles.payButton} onPress={handleProceedToPay}>
            <Text style={styles.payButtonText}>Proceed to Pay</Text>
          </TouchableOpacity>
        </View>
      )}
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
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#FFFFFF', 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  tabContainer: { 
    flexDirection: 'row', 
    marginHorizontal: 20, 
    backgroundColor: '#E5E7EB', 
    borderRadius: 12, 
    padding: 4, 
    marginTop: 10 
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#FFFFFF', elevation: 1, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  activeTabText: { color: '#111827' },
  scrollContent: { padding: 20, paddingBottom: 160 },
  dueCard: { 
    backgroundColor: '#1E3A8A', 
    borderRadius: 20, 
    padding: 25, 
    alignItems: 'center', 
    marginBottom: 25 
  },
  dueLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 8 },
  dueAmount: { color: '#FFFFFF', fontSize: 36, fontWeight: 'bold', marginBottom: 15 },
  dueDateBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20 },
  dueDateText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 15 },
  breakdownContainer: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  breakdownLabel: { color: '#6B7280', fontSize: 15 },
  breakdownValue: { color: '#111827', fontSize: 15, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 10 },
  totalLabel: { color: '#111827', fontSize: 16, fontWeight: 'bold' },
  totalValue: { color: '#2563EB', fontSize: 18, fontWeight: 'bold' },
  historySection: { marginTop: 10 },
  txCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#F3F4F6', elevation: 2, shadowColor: '#000', shadowOpacity: 0.02
  },
  pendingTxCard: { borderColor: '#FEF3C7', backgroundColor: '#FFFDF5' },
  txLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  txDetails: { gap: 2 },
  txDesc: { fontSize: 15, fontWeight: 'bold', color: '#111827' },
  txDate: { fontSize: 12, color: '#6B7280' },
  txAmount: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyIcon: { marginBottom: 10 },
  emptyText: { color: '#6B7280', fontSize: 16 },
  bottomBar: { 
    position: 'absolute', 
    bottom: 75,
    left: 0, 
    right: 0, 
    backgroundColor: '#FFFFFF', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 25, 
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10
  },
  bottomBarLabel: { color: '#6B7280', fontSize: 12 },
  bottomBarAmount: { color: '#111827', fontSize: 20, fontWeight: 'bold' },
  payButton: { backgroundColor: '#10B981', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12 },
  payButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});

export default PayBillsScreen;