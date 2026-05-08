import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import GuardDashboard from '../screens/GuardDashboard';
import ProfileScreen from '../screens/ProfileScreen';
import WalkInEntryScreen from '../screens/WalkInEntryScreen';
import VehicleSearchScreen from '../screens/VehicleSearchScreen';

import GuardParcelsScreen from '../screens/GuardParcelsScreen';
import GuardDailyHelpScreen from '../screens/GuardDailyHelpScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const GuardHomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={GuardDashboard} />
      <Stack.Screen name="WalkInEntry" component={WalkInEntryScreen} />
      <Stack.Screen name="VehicleSearch" component={VehicleSearchScreen} />
      
      {/* Newly Added Guard Sub Screens */}
      <Stack.Screen name="GuardParcels" component={GuardParcelsScreen} />
      <Stack.Screen name="GuardDailyHelp" component={GuardDailyHelpScreen} />
    </Stack.Navigator>
  );
};

const GuardTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#1F2937', // Dark Gray from GuardDashboard
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
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
        component={GuardHomeStack} 
        options={{ 
          tabBarIcon: ({ color }) => <Icon name="shield-checkmark" size={22} color={color} /> 
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
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 }
  }
});

export default GuardTabNavigator;
