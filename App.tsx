import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNetInfo } from '@react-native-community/netinfo';
import { Provider as PaperProvider } from 'react-native-paper';

// Context and Core Screens
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import LoginScreen from './src/screens/LoginScreen';
import GuardTabNavigator from './src/navigation/GuardTabNavigator';
import SecretaryTabNavigator from './src/navigation/SecretaryTabNavigator';
import LoadingScreen from './src/LoadingScreen';
import ResidentTabNavigator from './src/navigation/ResidentTabNavigator';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

// Profile Sub-Screens
import FamilyMembersScreen from './src/screens/FamilyMembersScreen';
import MyVehiclesScreen from './src/screens/MyVehiclesScreen';
import PetsScreen from './src/screens/PetsScreen';
import EditPhoneScreen from './src/screens/EditPhoneScreen';
import EditEmailScreen from './src/screens/EditEmailScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import NotificationSettingsScreen from './src/screens/NotificationSettingsScreen';
import LanguageScreen from './src/screens/LanguageScreen';
import TermsPrivacyScreen from './src/screens/TermsPrivacyScreen';

// Feature & Add Screens
import CreateTicketScreen from './src/screens/CreateTicketScreen';
import AddStaffScreen from './src/screens/AddStaffScreen';
import AddVehicleScreen from './src/screens/AddVehicleScreen';
import AddResidentScreen from './src/screens/AddResidentScreen';
import AddFamilyMemberScreen from './src/screens/AddFamilyMemberScreen';
import AddPetScreen from './src/screens/AddPetScreen';

import BroadcastNoticeScreen from './src/screens/BroadcastNoticeScreen';
import ManageStaffScreen from './src/screens/ManageStaffScreen';
import ManageResidentsScreen from './src/screens/ManageResidentsScreen';
import ManageDailyHelpScreen from './src/screens/ManageDailyHelpScreen';
import FinancialsScreen from './src/screens/FinancialsScreen';
import AdminHelpdeskScreen from './src/screens/AdminHelpdeskScreen';
import CommunityScreen from './src/screens/CommunityScreen';

export type RootStackParamList = {
  Login: undefined;
  ForgotPasswordScreen: undefined;
  ResidentHome: undefined;
  GuardHome: undefined;
  SecretaryHome: undefined;
  FamilyMembers: undefined;
  MyVehicles: undefined;
  Pets: undefined;
  EditPhone: undefined;
  EditEmail: undefined;
  ChangePassword: undefined;
  NotificationSettings: undefined;
  Language: undefined;
  TermsPrivacy: undefined;
  CreateTicket: undefined;
  AddStaff: undefined;
  AddVehicle: undefined;
  AddResident: undefined;
  AddFamilyMember: undefined;
  AddPet: undefined;
  BroadcastNotice: undefined;
  ManageStaff: undefined;
  ManageResidents: undefined;
  ManageDailyHelp: undefined;
  Financials: undefined;
  AdminHelpdesk: undefined;
  Community: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { userToken, userRole, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // ==========================================
  // AUTH STACK (FOR NON-LOGGED IN USERS)
  // ==========================================
  if (userToken == null) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    );
  }

  // ==========================================
  // DEFENSIVE CASE-INSENSITIVE ROLE MATCHING
  // ==========================================
  const rawRole = userRole ? String(userRole).toLowerCase().trim() : '';
  const isResident = rawRole === 'resident' || rawRole === 'owner' || rawRole === 'tenant';
  const isGuard = rawRole === 'guard';
  const isSecretary = rawRole === 'secretary' || rawRole === 'admin';

  // ==========================================
  // APP STACK (FOR LOGGED IN USERS)
  // ==========================================
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName={
        isResident 
          ? "ResidentHome" 
          : isGuard 
            ? "GuardHome" 
            : "SecretaryHome"
      }
    >
      {isResident && <Stack.Screen name="ResidentHome" component={ResidentTabNavigator} />}
      {isGuard && <Stack.Screen name="GuardHome" component={GuardTabNavigator} />}
      {isSecretary && <Stack.Screen name="SecretaryHome" component={SecretaryTabNavigator} />}
      
      {/* Shared Profile Screens */}
      <Stack.Screen name="FamilyMembers" component={FamilyMembersScreen} />
      <Stack.Screen name="MyVehicles" component={MyVehiclesScreen} />
      <Stack.Screen name="Pets" component={PetsScreen} />
      <Stack.Screen name="EditPhone" component={EditPhoneScreen} />
      <Stack.Screen name="EditEmail" component={EditEmailScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="TermsPrivacy" component={TermsPrivacyScreen} />
      
      {/* Feature & Add Screens */}
      <Stack.Screen name="CreateTicket" component={CreateTicketScreen} />
      <Stack.Screen name="AddStaff" component={AddStaffScreen} />
      <Stack.Screen name="AddVehicle" component={AddVehicleScreen} />
      <Stack.Screen name="AddResident" component={AddResidentScreen} />
      <Stack.Screen name="AddFamilyMember" component={AddFamilyMemberScreen} />
      <Stack.Screen name="AddPet" component={AddPetScreen} />

      {/* Secretary Direct Feature Screens */}
      <Stack.Screen name="BroadcastNotice" component={BroadcastNoticeScreen} />
      <Stack.Screen name="ManageStaff" component={ManageStaffScreen} />
      <Stack.Screen name="ManageResidents" component={ManageResidentsScreen} />
      <Stack.Screen name="ManageDailyHelp" component={ManageDailyHelpScreen} />
      <Stack.Screen name="Financials" component={FinancialsScreen} />
      <Stack.Screen name="AdminHelpdesk" component={AdminHelpdeskScreen} />
      <Stack.Screen name="Community" component={CommunityScreen} />
    </Stack.Navigator>
  );
};

const App = () => {
  const netInfo = useNetInfo();
  // isConnected is true or false. null when unknown.
  const isDisconnected = netInfo.isConnected === false;

  return (
    <View style={styles.container}>
      {isDisconnected && (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}>No Internet Connection</Text>
          <Text style={styles.offlineSubText}>Please connect to Wi-Fi or mobile data to use the app.</Text>
        </View>
      )}
      <PaperProvider>
        <AuthProvider>
          <AppProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </AppProvider>
        </AuthProvider>
      </PaperProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  offlineContainer: {
    backgroundColor: '#b52424',
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: Platform.OS === 'ios' ? 45 : 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99999, // ensure it's on top of everything
    elevation: 99999,
  },
  offlineText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  offlineSubText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  }
});

export default App;