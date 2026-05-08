import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

// 1. Import all Dashboard & Sub-feature Screens (The Home Stack)
import ResidentDashboard from '../screens/ResidentDashboard';
import PayBillsScreen from '../screens/PayBillsScreen';
import PreApproveScreen from '../screens/PreApproveScreen';
import NoticesScreen from '../screens/NoticesScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import DirectoryScreen from '../screens/DirectoryScreen';
import AmenitiesBookingScreen from '../screens/AmenitiesBookingScreen';

// Sub-Feature Screens for Resident
import VisitorHistoryScreen from '../screens/VisitorHistoryScreen';
import ManageDailyHelpScreen from '../screens/ManageDailyHelpScreen';
import ResidentParcelsScreen from '../screens/ResidentParcelsScreen';

// 2. Import the main Tab Screens
import CommunityScreen from '../screens/CommunityScreen';
import ServicesScreen from '../screens/ServicesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ==========================================
// THE HOME STACK
// ==========================================
const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={ResidentDashboard} />
      <Stack.Screen name="PayBills" component={PayBillsScreen} />
      <Stack.Screen name="PreApprove" component={PreApproveScreen} />
      <Stack.Screen name="Notices" component={NoticesScreen} />
      <Stack.Screen name="Emergency" component={EmergencyScreen} />
      <Stack.Screen name="Directory" component={DirectoryScreen} />
      <Stack.Screen name="AmenitiesBooking" component={AmenitiesBookingScreen} />
      
      {/* Newly Added Resident Sub Screens */}
      <Stack.Screen name="VisitorHistory" component={VisitorHistoryScreen} />
      <Stack.Screen name="ManageDailyHelp" component={ManageDailyHelpScreen} />
      <Stack.Screen name="ResidentParcels" component={ResidentParcelsScreen} />
    </Stack.Navigator>
  );
};

// ==========================================
// THE MAIN TAB NAVIGATOR
// ==========================================
const ResidentTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#1E3A8A', // Active icon color
        tabBarInactiveTintColor: '#9CA3AF', // Inactive icon color
        tabBarHideOnKeyboard: true, // Auto-hides the tab bar when typing
        tabBarShowLabel: true, // Set to false if you only want icons
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: -5,
          marginBottom: 5,
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackNavigator} 
        options={{ 
          tabBarIcon: ({ color }) => <Icon name="home" size={22} color={color} /> 
        }}
      />
      
      <Tab.Screen 
        name="Community" 
        component={CommunityScreen} 
        options={{ 
          tabBarIcon: ({ color }) => <Icon name="people" size={22} color={color} /> 
        }}
      />
      
      <Tab.Screen 
        name="Services" 
        component={ServicesScreen} 
        options={{ 
          tabBarIcon: ({ color }) => <Icon name="construct" size={22} color={color} /> 
        }}
      />
      
      <Tab.Screen 
        name="Bills" 
        component={PayBillsScreen} 
        options={{ 
          tabBarIcon: ({ color }) => <Icon name="wallet" size={22} color={color} /> 
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          tabBarIcon: ({ color }) => <Icon name="person" size={22} color={color} /> 
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FFFFFF',
    position: 'absolute', // Allows the UI to flow underneath the curved corners
    borderTopWidth: 0,
    elevation: 15, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 }
  }
});

export default ResidentTabNavigator;