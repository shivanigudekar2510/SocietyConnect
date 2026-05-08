import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Alert, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FinancialsScreen = ({ navigation }: any) => {
  const [balance, setBalance] = useState(1245000);
  const [transactions, setTransactions] = useState([
    { id: '1', desc: 'Maintenance Collection', amount: '+₹42,000', type: 'credit', date: 'May 01' },
    { id: '2', desc: 'Elevator AMC', amount: '-₹15,000', type: 'debit', date: 'Apr 28' },
    { id: '3', desc: 'Water Bill', amount: '-₹8,500', type: 'debit', date: 'Apr 25' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [desc, setDesc] = useState('');
  const [amountInput, setAmountInput] = useState('');

  const handleRecord = (type: 'credit' | 'debit') => {
    if (!desc.trim() || !amountInput.trim()) {
      Alert.alert('Required', 'Please enter a description and amount.');
      return;
    }
    const amt = parseInt(amountInput, 10);
    if (isNaN(amt) || amt <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    if (type === 'debit') {
      setBalance(prev => prev - amt);
      setTransactions(prev => [
        {
          id: Math.random().toString(),
          desc: desc.trim(),
          amount: `-₹${amt.toLocaleString()}`,
          type: 'debit',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
        },
        ...prev
      ]);
    } else {
      setBalance(prev => prev + amt);
      setTransactions(prev => [
        {
          id: Math.random().toString(),
          desc: desc.trim(),
          amount: `+₹${amt.toLocaleString()}`,
          type: 'credit',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
        },
        ...prev
      ]);
    }

    setDesc('');
    setAmountInput('');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Financials</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Society Fund Balance</Text>
          <Text style={styles.balanceAmount}>₹{balance.toLocaleString()}</Text>
        </View>

        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.map((tx) => (
          <View key={tx.id} style={styles.txCard}>
            <View style={styles.txIconContainer}>
              <Icon name={tx.type === 'credit' ? 'arrow-down' : 'arrow-up'} size={20} color={tx.type === 'credit' ? '#10B981' : '#EF4444'} />
            </View>
            <View style={styles.txDetails}>
              <Text style={styles.txDesc}>{tx.desc}</Text>
              <Text style={styles.txDate}>{tx.date}</Text>
            </View>
            <Text style={[styles.txAmount, { color: tx.type === 'credit' ? '#10B981' : '#111827' }]}>
              {tx.amount}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Transaction Logging Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Transaction</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Electric bill, Maintenance collection"
              placeholderTextColor="#9CA3AF"
              value={desc}
              onChangeText={setDesc}
            />

            <Text style={styles.label}>Amount (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 1200"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              value={amountInput}
              onChangeText={setAmountInput}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.debitBtn]} onPress={() => handleRecord('debit')}>
                <Text style={styles.btnText}>Record Expense (-)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.creditBtn]} onPress={() => handleRecord('credit')}>
                <Text style={styles.btnText}>Record Income (+)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Icon name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
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
  balanceCard: {
    backgroundColor: '#312E81', borderRadius: 20, padding: 25, alignItems: 'center', marginBottom: 30,
    elevation: 8, shadowColor: '#312E81', shadowOpacity: 0.2, shadowRadius: 10
  },
  balanceLabel: { color: '#C7D2FE', fontSize: 14, marginBottom: 8 },
  balanceAmount: { color: '#FFFFFF', fontSize: 32, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 15 },
  txCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    padding: 16, borderRadius: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#F3F4F6'
  },
  txIconContainer: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#F9FAFB',
    justifyContent: 'center', alignItems: 'center', marginRight: 15
  },
  txDetails: { flex: 1 },
  txDesc: { fontSize: 15, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  txDate: { fontSize: 13, color: '#6B7280' },
  txAmount: { fontSize: 16, fontWeight: 'bold' },
  fab: { 
    position: 'absolute', bottom: 90, right: 20,
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#312E81', 
    justifyContent: 'center', alignItems: 'center',
    elevation: 8, shadowColor: '#312E81', shadowOpacity: 0.3, shadowRadius: 8
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '85%', backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  label: { fontSize: 14, fontWeight: '600', color: '#4B5563', marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: '#F3F4F6', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 15, height: 48, fontSize: 15, color: '#111827', marginBottom: 10 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  debitBtn: { backgroundColor: '#EF4444' },
  creditBtn: { backgroundColor: '#10B981' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 13 }
});

export default FinancialsScreen;
