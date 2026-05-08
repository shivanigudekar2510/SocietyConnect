import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  SafeAreaView, KeyboardAvoidingView, Platform, Alert,
  ActivityIndicator, Animated, LayoutAnimation, UIManager,
  Keyboard, TouchableWithoutFeedback
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LoginScreen = ({ navigation }: any) => {
  const { login } = useAuth();
  
  // Network and UI State
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [inputValue, setInputValue] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState<'input' | 'password' | null>(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const internetAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Entrance Animation
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 20, friction: 7, useNativeDriver: true }),
    ]).start();

    // Internet Monitoring
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      Animated.timing(internetAnim, {
        toValue: state.isConnected ? -100 : 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (!isConnected) {
        Alert.alert("Offline", "Please check your internet connection.");
        return;
    }
    if (!inputValue.trim() || !password.trim()) {
      Alert.alert("Missing Fields", "Please enter your credentials.");
      return;
    }
    setLoading(true);

    try {
      const firestore = require('@react-native-firebase/firestore').default;
      const emailLower = inputValue.trim().toLowerCase();

      // Check database if user exists
      const querySnapshot = await firestore()
        .collection('users')
        .where('email', '==', emailLower)
        .get();

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        if (userData.password === password) {
          await firestore().collection('login_activity').add({
            email: emailLower,
            timestamp: new Date().toISOString(),
            success: true,
            databaseMatch: true
          });
          setLoading(false);
          login('firebase-token', userData.role || 'resident', emailLower);
          return;
        } else {
          setLoading(false);
          Alert.alert("Authentication Failed", "Incorrect password.");
          return;
        }
      } else {
        // Automatically create this user if it doesn't exist, to bootstrap the test database!
        let role: 'resident' | 'guard' | 'secretary' = 'resident';
        let name = 'Resident User';
        if (emailLower.includes('guard')) { role = 'guard'; name = 'Security Guard'; }
        if (emailLower.includes('admin') || emailLower.includes('secretary')) { role = 'secretary'; name = 'Committee Secretary'; }

        const newUserDoc = {
          email: emailLower,
          password: password,
          role: role,
          name: name,
          flat: role === 'resident' ? 'Flat 402' : 'Management Office',
          phone: '+91 98765 43210'
        };

        await firestore().collection('users').add(newUserDoc);
        
        await firestore().collection('login_activity').add({
          email: emailLower,
          timestamp: new Date().toISOString(),
          success: true,
          databaseMatch: true
        });

        setLoading(false);
        login('firebase-token', role, emailLower);
        return;
      }
    } catch (err) {
      setLoading(false);
      console.log('ℹ️ Local offline mode or Firebase error.', err);
      Alert.alert("Error", "Could not connect to the database. Please try again.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* No Internet Banner */}
        <Animated.View style={[styles.offlineContainer, { transform: [{ translateY: internetAnim }] }]}>
          <Icon name="cloud-offline-outline" size={20} color="white" />
          <Text style={styles.offlineText}>No Internet Connection</Text>
        </Animated.View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], width: '100%' }}>
            
            <View style={styles.headerSection}>
              <View style={styles.logoCircle}>
                <Icon name="business" size={40} color="#2563EB" />
              </View>
              <Text style={styles.title}>Smart Society</Text>
              <Text style={styles.subtitle}>Secure Access Portal</Text>
            </View>

            <View style={styles.inputSection}>
              <View style={[styles.inputWrapper, isFocused === 'input' && styles.inputFocused]}>
                <Icon name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email or Mobile"
                  placeholderTextColor="#9CA3AF"
                  value={inputValue}
                  onFocus={() => setIsFocused('input')}
                  onBlur={() => setIsFocused(null)}
                  onChangeText={setInputValue}
                  autoCapitalize="none"
                />
              </View>

              <View style={[styles.inputWrapper, isFocused === 'password' && styles.inputFocused]}>
                <Icon name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onFocus={() => setIsFocused('password')}
                  onBlur={() => setIsFocused(null)}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <Icon name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.forgotBtn} 
                onPress={() => navigation.navigate('ForgotPasswordScreen')}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
                style={[styles.mainButton, (loading || !isConnected) && styles.buttonDisabled]} 
                onPress={handleLogin} 
                disabled={loading}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Sign In</Text>}
            </TouchableOpacity>

          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, paddingHorizontal: 30, justifyContent: 'center' },
  offlineContainer: {
    backgroundColor: '#EF4444', height: 45, flexDirection: 'row', 
    justifyContent: 'center', alignItems: 'center', position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 0, left: 0, right: 0, zIndex: 1000
  },
  offlineText: { color: 'white', fontSize: 14, fontWeight: '700', marginLeft: 8 },
  headerSection: { alignItems: 'center', marginBottom: 40 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 28, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  inputSection: { marginBottom: 20 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FAFAFA', borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 16, paddingHorizontal: 15, height: 60, marginBottom: 15 },
  inputFocused: { borderColor: '#2563EB', backgroundColor: '#FFFFFF' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#111827' },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -5, marginBottom: 10 },
  forgotText: { color: '#2563EB', fontWeight: '600', fontSize: 14 },
  mainButton: { height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2563EB', elevation: 4 },
  buttonDisabled: { backgroundColor: '#93C5FD' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  dummyHintContainer: { display: 'none' }
});

export default LoginScreen;