import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, Image,
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, Alert, ScrollView, Modal, Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';

const { width } = Dimensions.get('window');

const CreateTicketScreen = ({ navigation }: any) => {
  const [category, setCategory] = useState('Plumbing');
  const [issue, setIssue] = useState('');
  const [photoUri, setPhotoUri] = useState('');
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  const categories = ['Plumbing', 'Electrical', 'Carpentry', 'Cleaning', 'Other'];

  const sampleGallery = [
    { id: '1', title: 'Leaking Tap', uri: 'https://images.unsplash.com/photo-1584622650111-94365c760411?auto=format&fit=crop&w=400' },
    { id: '2', title: 'Flickering Bulb', uri: 'https://images.unsplash.com/photo-1517420728120-1e537e265ee4?auto=format&fit=crop&w=400' },
    { id: '3', title: 'Cracked Tile', uri: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=400' },
    { id: '4', title: 'Jammed Lock', uri: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=400' },
  ];

  const handlePickFromDeviceGallery = () => {
    try {
      if (typeof launchImageLibrary !== 'function') {
        throw new Error("launchImageLibrary is not a function");
      }
      launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
          Alert.alert("Error", "Could not access device gallery.");
        } else if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          if (uri) {
            setPhotoUri(uri);
            setGalleryVisible(false);
          }
        }
      });
    } catch (e) {
      console.log('Device picker unavailable without native rebuild fallback.', e);
      Alert.alert(
        "Rebuild Required",
        "Accessing the real device gallery requires rebuilding the app binary. Please use our sample quick selection instead or paste an image URL.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Use Sample Photo", onPress: () => handleSelectFromGallery('https://images.unsplash.com/photo-1584622650111-94365c760411?auto=format&fit=crop&w=400') }
        ]
      );
    }
  };

  const handleSelectFromGallery = (uri: string) => {
    setPhotoUri(uri);
    setGalleryVisible(false);
  };

  const handleUseCustomUrl = () => {
    if (!customUrl.trim()) {
      Alert.alert("Required", "Please paste or enter a valid URL.");
      return;
    }
    setPhotoUri(customUrl.trim());
    setCustomUrl('');
    setGalleryVisible(false);
  };

  const handleSubmit = async () => {
    if (!issue.trim()) {
      Alert.alert("Required", "Please describe the issue.");
      return;
    }
    
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      await firestore().collection('tickets').add({
        ticketNo: `#SR-${Math.floor(1000 + Math.random() * 9000)}`,
        category,
        issue: issue.trim(),
        status: 'Pending',
        photo: photoUri || null,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        timestamp: new Date().toISOString()
      });

      Alert.alert(
        "Ticket Created", 
        "Your service request has been sent to the maintenance team.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      console.log('Error creating ticket', err);
      Alert.alert("Error", "Could not submit service request.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Service Request</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Category Selection */}
          <Text style={styles.label}>Select Category</Text>
          <View style={styles.pillContainer}>
            {categories.map((cat) => (
              <TouchableOpacity 
                key={cat}
                style={[styles.pill, category === cat && styles.pillActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.pillText, category === cat && styles.pillTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Issue Description */}
          <Text style={styles.label}>Describe the Issue</Text>
          <TextInput
            style={styles.textArea}
            placeholder="E.g., The tap in the kitchen is leaking..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            value={issue}
            onChangeText={setIssue}
          />

          {/* Photo Section */}
          <Text style={styles.label}>Photo (Optional)</Text>
          {photoUri ? (
            <View style={styles.attachedPhotoContainer}>
              <Image source={{ uri: photoUri }} style={styles.attachedPhoto} />
              <TouchableOpacity style={styles.removePhotoButton} onPress={() => setPhotoUri('')}>
                <Icon name="close-circle" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.attachButton} onPress={() => setGalleryVisible(true)}>
              <Icon name="images" size={24} color="#6B7280" />
              <Text style={styles.attachButtonText}>Choose Photo Option</Text>
            </TouchableOpacity>
          )}

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Request</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Gallery Selector Modal */}
      <Modal visible={galleryVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Photo</Text>
              <TouchableOpacity onPress={() => setGalleryVisible(false)}>
                <Icon name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              
              {/* Direct Gallery Option */}
              <TouchableOpacity style={styles.deviceGalleryBtn} onPress={handlePickFromDeviceGallery}>
                <Icon name="image" size={24} color="#FFFFFF" />
                <Text style={styles.deviceGalleryBtnText}>From My Device Gallery</Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>Quick Selection Samples</Text>
              <View style={styles.galleryGrid}>
                {sampleGallery.map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.galleryCard}
                    onPress={() => handleSelectFromGallery(item.uri)}
                  >
                    <Image source={{ uri: item.uri }} style={styles.galleryImg} />
                    <Text style={styles.galleryLabel}>{item.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.customInputContainer}>
                <Text style={styles.sectionTitle}>Or Paste Image URL</Text>
                <TextInput
                  style={styles.customUrlInput}
                  placeholder="https://example.com/photo.jpg"
                  placeholderTextColor="#9CA3AF"
                  value={customUrl}
                  onChangeText={setCustomUrl}
                />
                <TouchableOpacity style={styles.customUrlBtn} onPress={handleUseCustomUrl}>
                  <Text style={styles.customUrlBtnText}>Add URL</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  content: { padding: 20, paddingBottom: 60 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 12, marginTop: 10 },
  pillContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  pill: { 
    backgroundColor: '#FFFFFF', paddingVertical: 10, paddingHorizontal: 16, 
    borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' 
  },
  pillActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  pillText: { fontSize: 14, fontWeight: '500', color: '#4B5563' },
  pillTextActive: { color: '#FFFFFF' },
  textArea: {
    backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB',
    padding: 15, fontSize: 16, color: '#111827', minHeight: 110, marginBottom: 20
  },
  attachButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB',
    paddingVertical: 14, marginBottom: 30, borderStyle: 'dashed'
  },
  attachButtonText: { color: '#4B5563', fontSize: 15, fontWeight: '600' },
  attachedPhotoContainer: {
    position: 'relative', width: '100%', height: 160, borderRadius: 12, 
    overflow: 'hidden', marginBottom: 30, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#E5E7EB'
  },
  attachedPhoto: { width: '100%', height: '100%', resizeMode: 'cover' },
  removePhotoButton: { position: 'absolute', top: 10, right: 10 },
  submitButton: { 
    backgroundColor: '#10B981', paddingVertical: 15, borderRadius: 12, 
    alignItems: 'center', elevation: 2, shadowColor: '#10B981', shadowOpacity: 0.3, shadowRadius: 5
  },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, height: '75%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  deviceGalleryBtn: { 
    backgroundColor: '#2563EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    gap: 10, height: 56, borderRadius: 16, marginBottom: 25, marginTop: 5,
    elevation: 3, shadowColor: '#2563EB', shadowOpacity: 0.2, shadowRadius: 5
  },
  deviceGalleryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#4B5563', marginBottom: 15, marginTop: 5 },
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 20 },
  galleryCard: { width: (width - 74) / 2, backgroundColor: '#F9FAFB', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  galleryImg: { width: '100%', height: 100, resizeMode: 'cover' },
  galleryLabel: { padding: 8, fontSize: 12, fontWeight: '600', color: '#111827', textAlign: 'center' },
  customInputContainer: { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 20, marginBottom: 10 },
  customUrlInput: { backgroundColor: '#F3F4F6', borderRadius: 12, height: 50, paddingHorizontal: 15, color: '#111827', fontSize: 15, marginBottom: 12 },
  customUrlBtn: { backgroundColor: '#2563EB', height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  customUrlBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' }
});

export default CreateTicketScreen;