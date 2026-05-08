import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const LanguageScreen = ({ navigation }: any) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = [
    { id: '1', name: 'English', nativeName: 'English' },
    { id: '2', name: 'Hindi', nativeName: 'हिन्दी' },
    { id: '3', name: 'Marathi', nativeName: 'मराठी' },
    { id: '4', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Language</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={languages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.langCard, selectedLanguage === item.name && styles.activeCard]}
            onPress={() => setSelectedLanguage(item.name)}
          >
            <View style={styles.langDetails}>
              <Text style={[styles.langName, selectedLanguage === item.name && styles.activeText]}>{item.name}</Text>
              <Text style={[styles.nativeName, selectedLanguage === item.name && styles.activeText]}>{item.nativeName}</Text>
            </View>
            {selectedLanguage === item.name && (
              <Icon name="checkmark-circle" size={24} color="#2563EB" />
            )}
          </TouchableOpacity>
        )}
      />
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
  listContainer: { padding: 20 },
  langCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', padding: 18, borderRadius: 16, marginBottom: 15,
    borderWidth: 1, borderColor: '#F3F4F6'
  },
  activeCard: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  langDetails: { flexDirection: 'column' },
  langName: { fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 4 },
  nativeName: { fontSize: 14, color: '#9CA3AF' },
  activeText: { color: '#111827' }
});

export default LanguageScreen;
