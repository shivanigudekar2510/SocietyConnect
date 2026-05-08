import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar, TextInput, Alert } from 'react-native';
import { useAppContext, Parcel } from '../context/AppContext';
import Icon from 'react-native-vector-icons/Ionicons';

const GuardParcelsScreen = ({ navigation }: any) => {
  const { parcels, addParcel, collectParcel } = useAppContext();
  const [showAdd, setShowAdd] = useState(false);

  // Form state
  const [flat, setFlat] = useState('');
  const [carrier, setCarrier] = useState('');
  const [recipient, setRecipient] = useState('');

  // Collect parcel state
  const [activeCollectId, setActiveCollectId] = useState<string | null>(null);
  const [pickupCode, setPickupCode] = useState('');

  const handleAddParcel = () => {
    if (!flat.trim() || !carrier.trim() || !recipient.trim()) return;
    const dateStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    addParcel({
      flat,
      deliveryCompany: carrier,
      recipientName: recipient,
      date: dateStr,
      time: timeStr
    });
    setFlat('');
    setCarrier('');
    setRecipient('');
    setShowAdd(false);
    Alert.alert('Success', 'Parcel registered at gate.');
  };

  const handleCollectSubmit = () => {
    if (!activeCollectId || !pickupCode) return;
    const ok = collectParcel(activeCollectId, pickupCode);
    if (ok) {
      setPickupCode('');
      setActiveCollectId(null);
      Alert.alert('Parcel Picked Up', 'Delivery collected by resident.');
    } else {
      Alert.alert('Incorrect Code', 'The pickup code did not match.');
    }
  };

  const renderItem = ({ item }: { item: Parcel }) => {
    const isCollected = item.status === 'Collected';
    const isActiveInput = activeCollectId === item.id;

    return (
      <View style={[styles.card, isCollected && styles.cardCollected]}>
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle}>{item.deliveryCompany} • {item.recipientName}</Text>
          <Text style={styles.cardSub}>{item.flat} • {item.date} {item.time}</Text>

          {isActiveInput && (
            <View style={styles.collectRow}>
              <TextInput
                style={styles.codeInput}
                placeholder="Enter Code"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                value={pickupCode}
                onChangeText={setPickupCode}
              />
              <TouchableOpacity style={styles.confirmBtn} onPress={handleCollectSubmit}>
                <Text style={styles.confirmBtnText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setActiveCollectId(null)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {!isCollected && !isActiveInput && (
          <TouchableOpacity style={styles.collectActionBtn} onPress={() => { setActiveCollectId(item.id); setPickupCode(''); }}>
            <Text style={styles.collectActionText}>Collect</Text>
          </TouchableOpacity>
        )}

        {isCollected && (
          <View style={styles.collectedBadge}>
            <Text style={styles.collectedText}>Picked up</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />

      {/* Guard Theme Dark Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Guard Parcel Log</Text>
            <Text style={styles.headerSubtitle}>Gate pickup and drop management</Text>
          </View>
        </View>
      </View>

      <View style={styles.mainArea}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Gate Deliveries</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAdd(!showAdd)}>
            <Icon name={showAdd ? 'close' : 'add-circle'} size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>{showAdd ? 'Cancel' : 'New Parcel'}</Text>
          </TouchableOpacity>
        </View>

        {showAdd && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Register New Gate Drop</Text>
            <TextInput
              style={styles.input}
              placeholder="Flat (e.g. Flat 402)"
              placeholderTextColor="#94A3B8"
              value={flat}
              onChangeText={setFlat}
            />
            <TextInput
              style={styles.input}
              placeholder="Carrier Company (e.g. Amazon)"
              placeholderTextColor="#94A3B8"
              value={carrier}
              onChangeText={setCarrier}
            />
            <TextInput
              style={styles.input}
              placeholder="Recipient Name"
              placeholderTextColor="#94A3B8"
              value={recipient}
              onChangeText={setRecipient}
            />
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddParcel}>
              <Text style={styles.submitBtnText}>Drop at Gate</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={parcels}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { 
    backgroundColor: '#1F2937', 
    height: 120, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    paddingHorizontal: 20, 
    paddingTop: 15
  },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, color: 'white', fontWeight: 'bold' },
  headerSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2 },

  mainArea: { flex: 1, marginTop: -20, paddingHorizontal: 20 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 15 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#111827' },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10B981', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, gap: 4 },
  addButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },

  formCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, marginBottom: 15, borderWidth: 1, borderColor: '#E5E7EB', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05 },
  formTitle: { fontSize: 15, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', padding: 12, borderRadius: 12, fontSize: 14, color: '#111827', marginBottom: 12 },
  submitBtn: { backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  submitBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },

  listContainer: { paddingBottom: 110 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E5E7EB', elevation: 2, shadowColor: '#000', shadowOpacity: 0.03 },
  cardCollected: { opacity: 0.65, backgroundColor: '#F9FAFB' },
  cardDetails: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 },
  cardSub: { fontSize: 13, color: '#6B7280', marginBottom: 8 },

  collectRow: { flexDirection: 'row', gap: 8, marginTop: 5 },
  codeInput: { flex: 1, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, paddingHorizontal: 10, fontSize: 13, color: '#111827' },
  confirmBtn: { backgroundColor: '#10B981', paddingHorizontal: 12, borderRadius: 10, justifyContent: 'center' },
  confirmBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  cancelBtn: { backgroundColor: '#6B7280', paddingHorizontal: 10, borderRadius: 10, justifyContent: 'center' },
  cancelBtnText: { color: '#FFFFFF', fontSize: 12 },

  collectActionBtn: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  collectActionText: { color: '#2563EB', fontSize: 13, fontWeight: 'bold' },
  collectedBadge: { backgroundColor: '#E5E7EB', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  collectedText: { color: '#4B5563', fontSize: 12, fontWeight: '600' }
});

export default GuardParcelsScreen;
