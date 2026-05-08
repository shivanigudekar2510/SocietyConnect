import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppContext } from '../context/AppContext';

const amenitiesList = [
  { id: '1', name: 'Swimming Pool', icon: 'water' },
  { id: '2', name: 'Clubhouse', icon: 'business' },
  { id: '3', name: 'Tennis Court', icon: 'tennisball' },
  { id: '4', name: 'Gymnasium', icon: 'barbell' },
];

const timeSlots = ['06:00 AM', '08:00 AM', '10:00 AM', '04:00 PM', '06:00 PM', '08:00 PM'];

const AmenitiesBookingScreen = ({ navigation }: any) => {
  const { bookAmenity } = useAppContext();
  const [selectedAmenity, setSelectedAmenity] = useState(amenitiesList[0].name);
  const [selectedSlot, setSelectedSlot] = useState('');

  const handleBook = () => {
    if (!selectedSlot) {
      Alert.alert('Select a Slot', 'Please select a time slot to book.');
      return;
    }
    bookAmenity({
      flat: 'Flat 402',
      amenity: selectedAmenity,
      date: 'Today',
      timeSlot: selectedSlot
    });
    Alert.alert('Success', `Booked ${selectedAmenity} for ${selectedSlot}`, [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Amenities</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Select Facility</Text>
        <View style={styles.amenityGrid}>
          {amenitiesList.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.amenityCard, selectedAmenity === item.name && styles.amenityCardActive]}
              onPress={() => setSelectedAmenity(item.name)}
            >
              <Icon name={item.icon} size={30} color={selectedAmenity === item.name ? '#FFFFFF' : '#4B5563'} />
              <Text style={[styles.amenityName, selectedAmenity === item.name && styles.amenityNameActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Available Slots (Today)</Text>
        <View style={styles.slotsGrid}>
          {timeSlots.map((slot, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.slotCard, selectedSlot === slot && styles.slotCardActive]}
              onPress={() => setSelectedSlot(slot)}
            >
              <Text style={[styles.slotText, selectedSlot === slot && styles.slotTextActive]}>{slot}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
          <Text style={styles.bookButtonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
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
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 15, marginTop: 10 },
  amenityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginBottom: 20 },
  amenityCard: { 
    width: '47%', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, 
    alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB'
  },
  amenityCardActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  amenityName: { fontSize: 14, fontWeight: '600', color: '#4B5563', marginTop: 10 },
  amenityNameActive: { color: '#FFFFFF' },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slotCard: { 
    backgroundColor: '#FFFFFF', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20,
    borderWidth: 1, borderColor: '#E5E7EB'
  },
  slotCardActive: { backgroundColor: '#DBEAFE', borderColor: '#3B82F6' },
  slotText: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
  slotTextActive: { color: '#1D4ED8' },
  bookButton: { 
    backgroundColor: '#10B981', paddingVertical: 15, borderRadius: 12, 
    alignItems: 'center', marginTop: 40,
    elevation: 2, shadowColor: '#10B981', shadowOpacity: 0.3, shadowRadius: 5
  },
  bookButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});

export default AmenitiesBookingScreen;
