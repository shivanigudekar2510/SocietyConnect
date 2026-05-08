import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar, TextInput, Alert } from 'react-native';
import { useAppContext, DailyHelp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

const ManageDailyHelpScreen = ({ navigation }: any) => {
  const { dailyHelps, addDailyHelp, deleteDailyHelp } = useAppContext();
  const { userRole } = useAuth();
  const rawRole = userRole ? String(userRole).toLowerCase().trim() : '';
  const isSecretary = rawRole === 'secretary' || rawRole === 'admin';

  const [showAdd, setShowAdd] = useState(false);

  // Create state
  const [helpName, setHelpName] = useState('');
  const [helpCategory, setHelpCategory] = useState<'Maid' | 'Cook' | 'Driver' | 'Milkman' | 'Nanny' | 'Other'>('Maid');

  const myDailyHelps = dailyHelps;

  const handleAddSubmit = () => {
    if (!helpName.trim()) return;
    addDailyHelp({
      name: helpName,
      category: helpCategory,
      flat: 'All Flats'
    });
    setHelpName('');
    setShowAdd(false);
    Alert.alert('Success', `${helpName} registered as regular daily help.`);
  };

  const handleDeleteHelp = (id: string, name: string) => {
    Alert.alert(
      "Remove Daily Help",
      `Are you sure you want to remove ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteDailyHelp(id) }
      ]
    );
  };

  const renderItem = ({ item }: { item: DailyHelp }) => {
    const presenceColor = item.isPresent ? '#10B981' : '#EF4444';
    return (
      <View style={styles.helpCard}>
        <View style={styles.cardLeft}>
          <View style={styles.iconCircle}>
            <Icon name="person" size={24} color="#6366F1" />
          </View>
          <View style={styles.details}>
            <Text style={styles.helpName}>{item.name}</Text>
            <Text style={styles.helpCategory}>{item.category} • {item.flat || 'Society'}</Text>
            {item.lastCheckIn && (
              <Text style={styles.helpTime}>In: {item.lastCheckIn} {item.lastCheckOut ? `• Out: ${item.lastCheckOut}` : ''}</Text>
            )}
          </View>
        </View>
        <View style={styles.cardRight}>
          <View style={[styles.presenceBadge, { backgroundColor: item.isPresent ? '#E8F5E9' : '#FFEBEE' }]}>
            <Text style={[styles.presenceText, { color: presenceColor }]}>
              {item.isPresent ? 'Inside' : 'Outside'}
            </Text>
          </View>
          {isSecretary && (
            <TouchableOpacity style={styles.trashBtn} onPress={() => handleDeleteHelp(item.id, item.name)}>
              <Icon name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />

      {/* Header matching theme */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Daily Helpers</Text>
            <Text style={styles.headerSubtitle}>Maids, cooks, drivers, etc.</Text>
          </View>
        </View>
      </View>

      <View style={styles.mainArea}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>All Helpers ({myDailyHelps.length})</Text>
          {isSecretary && (
            <TouchableOpacity style={styles.addButton} onPress={() => setShowAdd(!showAdd)}>
              <Icon name={showAdd ? 'close' : 'add-circle'} size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>{showAdd ? 'Cancel' : 'Hire New'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {showAdd && isSecretary && (
          <View style={styles.addForm}>
            <Text style={styles.addFormTitle}>Add Registered Helper</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name (e.g. Ramesh Singh)"
              placeholderTextColor="#94A3B8"
              value={helpName}
              onChangeText={setHelpName}
            />
            <Text style={styles.labelSmall}>Helper Type / Category</Text>
            <View style={styles.categoryGrid}>
              {(['Maid', 'Cook', 'Driver', 'Milkman', 'Nanny', 'Other'] as const).map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catPill, helpCategory === cat && styles.catPillActive]}
                  onPress={() => setHelpCategory(cat)}
                >
                  <Text style={[styles.catText, helpCategory === cat && styles.catTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddSubmit}>
              <Text style={styles.submitBtnText}>Add to My Helpers</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={myDailyHelps}
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
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: {
    backgroundColor: '#1E3A8A',
    height: 120,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 15
  },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, color: 'white', fontWeight: 'bold' },
  headerSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },

  mainArea: { flex: 1, marginTop: -20, paddingHorizontal: 20 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563EB', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, gap: 4 },
  addButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },

  addForm: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, marginBottom: 15, borderWidth: 1, borderColor: '#E2E8F0', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05 },
  addFormTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 14 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', padding: 12, borderRadius: 12, fontSize: 14, color: '#0F172A', marginBottom: 15 },
  labelSmall: { fontSize: 13, color: '#475569', fontWeight: '600', marginBottom: 10 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 15 },
  catPill: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' },
  catPillActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  catText: { color: '#475569', fontSize: 13, fontWeight: '500' },
  catTextActive: { color: '#2563EB', fontWeight: 'bold' },
  submitBtn: { backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  submitBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },

  listContainer: { paddingBottom: 110 },
  helpCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#F1F5F9', elevation: 2, shadowColor: '#000', shadowOpacity: 0.02 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconCircle: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  details: { flex: 1 },
  helpName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 },
  helpCategory: { fontSize: 13, color: '#64748B', marginBottom: 4 },
  helpTime: { fontSize: 11, color: '#94A3B8' },
  cardRight: { alignItems: 'flex-end', gap: 8 },
  presenceBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  presenceText: { fontSize: 12, fontWeight: 'bold' },
  trashBtn: { padding: 4 }
});

export default ManageDailyHelpScreen;
