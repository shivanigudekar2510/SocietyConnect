import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import SecretaryDashboard from '../screens/SecretaryDashboard';
import ProfileScreen from '../screens/ProfileScreen';
import CommunityScreen from '../screens/CommunityScreen';
import BroadcastNoticeScreen from '../screens/BroadcastNoticeScreen';
import FinancialsScreen from '../screens/FinancialsScreen';
import ManageStaffScreen from '../screens/ManageStaffScreen';
import AdminHelpdeskScreen from '../screens/AdminHelpdeskScreen';
import ManageResidentsScreen from '../screens/ManageResidentsScreen';
import ManageDailyHelpScreen from '../screens/ManageDailyHelpScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const SecretaryHomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={SecretaryDashboard} />
      <Stack.Screen name="BroadcastNotice" component={BroadcastNoticeScreen} />
      <Stack.Screen name="Financials" component={FinancialsScreen} />
      <Stack.Screen name="ManageStaff" component={ManageStaffScreen} />
      <Stack.Screen name="AdminHelpdesk" component={AdminHelpdeskScreen} />
      <Stack.Screen name="ManageResidents" component={ManageResidentsScreen} />
      <Stack.Screen name="ManageDailyHelp" component={ManageDailyHelpScreen} />
    </Stack.Navigator>
  );
};

const SecretaryTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#312E81', // Executive Indigo from SecretaryDashboard
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
        component={SecretaryHomeStack} 
        options={{ 
          tabBarIcon: ({ color }) => <Icon name="stats-chart" size={22} color={color} /> 
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
        name="Financials" 
        component={FinancialsScreen} 
        options={{ 
          tabBarIcon: ({ color }) => <Icon name="cash" size={22} color={color} /> 
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

export default SecretaryTabNavigator;
