import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useAppContext, DailyHelp } from '../context/AppContext';
import Icon from 'react-native-vector-icons/Ionicons';

const GuardDailyHelpScreen = ({ navigation }: any) => {
  const { dailyHelps, toggleDailyHelpStatus } = useAppContext();

  const handleToggle = (item: DailyHelp) => {
    toggleDailyHelpStatus(item.id);
    Alert.alert(
      item.isPresent ? 'Marked as Out 🚪' : 'Marked as In 🔑',
      `${item.name} has been updated.`
    );
  };

  const renderItem = ({ item }: { item: DailyHelp }) => {
    const isInside = item.isPresent;
    const statusColor = isInside ? '#10B981' : '#EF4444';
    const btnColor = isInside ? '#EF4444' : '#10B981';

    return (
      <View style={styles.card}>
        <View style={styles.detailsArea}>
          <View style={styles.iconCircle}>
            <Icon name="person" size={24} color="#4F46E5" />
          </View>
          <View style={styles.details}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.category} • {item.flat}</Text>
            {item.lastCheckIn && (
              <Text style={styles.timeText}>Last In: {item.lastCheckIn} {item.lastCheckOut ? `• Out: ${item.lastCheckOut}` : ''}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: btnColor }]} 
          onPress={() => handleToggle(item)}
        >
          <Text style={styles.actionBtnText}>{isInside ? 'Check Out' : 'Check In'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />

      {/* Guard Theme Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Guard Daily Helpers</Text>
            <Text style={styles.headerSubtitle}>Mark check-in/out for registered help</Text>
          </View>
        </View>
      </View>

      <View style={styles.mainArea}>
        <FlatList
          data={dailyHelps}
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
  listContainer: { paddingBottom: 110 },

  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E5E7EB', elevation: 2, shadowColor: '#000', shadowOpacity: 0.03 },
  detailsArea: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconCircle: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 2 },
  meta: { fontSize: 13, color: '#6B7280', marginBottom: 4 },
  timeText: { fontSize: 11, color: '#9CA3AF' },
  actionBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  actionBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' }
});

export default GuardDailyHelpScreen;
