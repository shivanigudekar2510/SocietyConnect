import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppContext, Vehicle } from '../context/AppContext';

const VehicleSearchScreen = ({ navigation }: any) => {
  const { vehicles } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState<Vehicle | null | undefined>(undefined);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const query = searchQuery.replace(/\s/g, '').toUpperCase();
    const found = vehicles.find(v => v.plate.replace(/\s/g, '').toUpperCase() === query);
    setResult(found || null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle Search</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.content}>
          <Text style={styles.label}>Enter License Plate</Text>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.input}
              placeholder="e.g. MH 12 AB 1234"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
              <Icon name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {result === null && (
            <View style={styles.errorCard}>
              <Icon name="close-circle" size={40} color="#EF4444" />
              <Text style={styles.errorText}>Vehicle Not Found</Text>
              <Text style={styles.errorSub}>This vehicle is not registered to any flat.</Text>
            </View>
          )}

          {result && (
            <View style={styles.successCard}>
              <View style={styles.successHeader}>
                <Icon name="checkmark-circle" size={40} color="#10B981" />
                <Text style={styles.successText}>Vehicle Found</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailsRow}>
                <Text style={styles.detailLabel}>License Plate:</Text>
                <Text style={styles.detailValue}>{result.plate}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailLabel}>Flat Number:</Text>
                <Text style={styles.detailValue}>{result.flat}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailLabel}>Owner Name:</Text>
                <Text style={styles.detailValue}>{result.owner}</Text>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#1F2937'
  },
  backButton: { 
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', 
    justifyContent: 'center', alignItems: 'center'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  content: { padding: 20, paddingTop: 30 },
  label: { fontSize: 15, fontWeight: 'bold', color: '#374151', marginBottom: 10 },
  searchRow: { flexDirection: 'row', gap: 10, marginBottom: 30 },
  input: {
    flex: 1, height: 55, backgroundColor: '#FFFFFF', borderRadius: 12, 
    borderWidth: 1, borderColor: '#D1D5DB', paddingHorizontal: 15, fontSize: 18, fontWeight: 'bold'
  },
  searchBtn: { 
    width: 55, height: 55, backgroundColor: '#2563EB', borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    elevation: 2, shadowColor: '#2563EB', shadowOpacity: 0.3, shadowRadius: 5
  },
  errorCard: { 
    backgroundColor: '#FEF2F2', padding: 25, borderRadius: 16, alignItems: 'center',
    borderWidth: 1, borderColor: '#FCA5A5'
  },
  errorText: { fontSize: 20, fontWeight: 'bold', color: '#DC2626', marginTop: 10 },
  errorSub: { fontSize: 14, color: '#991B1B', marginTop: 5 },
  successCard: { 
    backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16,
    borderWidth: 1, borderColor: '#E5E7EB', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5
  },
  successHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  successText: { fontSize: 20, fontWeight: 'bold', color: '#10B981' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginBottom: 15 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  detailLabel: { fontSize: 15, color: '#6B7280' },
  detailValue: { fontSize: 15, fontWeight: 'bold', color: '#111827' }
});

export default VehicleSearchScreen;
