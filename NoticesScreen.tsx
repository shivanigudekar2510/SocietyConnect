import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, FlatList, 
  SafeAreaView, StatusBar, Dimensions 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

interface Notice {
  id: string;
  title: string;
  date: string;
  description: string;
  type: 'urgent' | 'general' | 'event';
  read: boolean;
}

const NoticesScreen = ({ navigation }: any) => {
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: '1',
      title: 'Water Supply Interruption',
      date: 'Today, 10:00 AM',
      description: 'Water supply will be suspended from 2 PM to 5 PM today for emergency tank cleaning.',
      type: 'urgent',
      read: false,
    }
  ]);

  useEffect(() => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      const unsubscribe = firestore().collection('notices').onSnapshot((snap: any) => {
        if (!snap) return;
        const docs: Notice[] = [];
        snap.forEach((doc: any) => {
          const data = doc.data();
          docs.push({
            id: doc.id,
            title: data.title,
            date: data.date || 'Today',
            description: data.description,
            type: data.isEmergency ? 'urgent' : 'general',
            read: !!data.read
          });
        });
        if (docs.length > 0) {
          setNotices(docs);
        }
      });
      return unsubscribe;
    } catch (e) {
      console.log('Error fetching notices', e);
    }
  }, []);

  const getTypeStyle = (type: Notice['type']) => {
    switch (type) {
      case 'urgent': return { bgColor: '#FEE2E2', textColor: '#DC2626', label: 'Urgent' };
      case 'event': return { bgColor: '#FEF3C7', textColor: '#D97706', label: 'Event' };
      default: return { bgColor: '#F3F4F6', textColor: '#4B5563', label: 'Update' };
    }
  };

  const markAsRead = (id: string) => {
    setNotices(notices.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const renderNotice = ({ item }: { item: Notice }) => {
    const typeStyle = getTypeStyle(item.type);

    return (
      <TouchableOpacity 
        style={[styles.noticeCard, !item.read && styles.unreadCard]}
        onPress={() => markAsRead(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.typeBadge, { backgroundColor: typeStyle.bgColor }]}>
            <Text style={[styles.typeText, { color: typeStyle.textColor }]}>{typeStyle.label}</Text>
          </View>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>

        <Text style={[styles.noticeTitle, !item.read && styles.unreadTitle]}>
          {item.title}
        </Text>
        <Text style={styles.noticeDescription} numberOfLines={3}>
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notice Board</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Stats/Filter Row */}
      <View style={styles.statsRow}>
        <Text style={styles.statsText}>
          You have <Text style={{ fontWeight: 'bold', color: '#DC2626' }}>
            {notices.filter(n => !n.read).length}
          </Text> unread notices.
        </Text>
      </View>

      {/* Notice List */}
      <FlatList
        data={notices}
        keyExtractor={(item) => item.id}
        renderItem={renderNotice}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', 
    justifyContent: 'center', alignItems: 'center',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },

  statsRow: { paddingHorizontal: 25, marginBottom: 10 },
  statsText: { color: '#6B7280', fontSize: 14 },

  listContainer: { padding: 20, paddingBottom: 100 },
  
  noticeCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5
  },
  unreadCard: {
    borderColor: '#E0E7FF',
    backgroundColor: '#FAFAF9',
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  typeText: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  dateText: { color: '#9CA3AF', fontSize: 12 },

  noticeTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 },
  unreadTitle: { color: '#111827', fontWeight: 'bold' },
  noticeDescription: { color: '#6B7280', fontSize: 14, lineHeight: 20 },
});

export default NoticesScreen;