// AppStack.js

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/Main/HomeScreen';
import ProfileScreen from '../screens/Main/ProfileScreen';
import SettingsScreen from '../screens/Main/SettingsScreen';
import MesoCycleScreen from '../screens/Main/MesoCycleScreen';
import DayDetailsScreen from '../screens/Main/DayDetailsScreen';
import ExerciseDetailsScreen from '../screens/Main/ExerciseDetailsScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Settings} from 'react-native';

const HomeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const MesoCycleStack = createNativeStackNavigator();

const MesoCycleStackNavigator = () => (
  <MesoCycleStack.Navigator>
    <MesoCycleStack.Screen
      name="MesoCycleScreen"
      component={MesoCycleScreen}
      options={{title: 'Meso Cycle'}}
    />
    <MesoCycleStack.Screen
      name="DayDetails"
      component={DayDetailsScreen}
      options={({route}) => ({title: `Day Details - ${route.params.dayId}`})}
    />
    <MesoCycleStack.Screen
      name="ExerciseDetails"
      component={ExerciseDetailsScreen}
      options={({route}) => ({
        title: `Exercise Details - ${route.params.exercise.title}`,
      })}
    />
  </MesoCycleStack.Navigator>
);

const HomeStackNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="HomeStackScreen" component={HomeScreen} />
  </HomeStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="ProfileStackScreen" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

const SettingsStackNavigator = () => (
  <SettingsStack.Navigator>
    <SettingsStack.Screen
      name="SettingsStackScreen"
      component={SettingsScreen}
    />
    <SettingsStack.Screen
      name="NotificationsScreen"
      component={SettingsScreen}
    />
    <SettingsStack.Screen name="PrivacyScreen" component={SettingsScreen} />
    <SettingsStack.Screen name="SecurityScreen" component={SettingsScreen} />
    <SettingsStack.Screen name="LanguageScreen" component={SettingsScreen} />
    <SettingsStack.Screen
      name="TermsOfServiceScreen"
      component={SettingsScreen}
    />
  </SettingsStack.Navigator>
);

const Tab = createBottomTabNavigator();

// Define a mapping from route names to icon names
const iconNames = {
  MesoCycle: 'fitness-center',
  Home: 'home',
  Profile: 'person',
  Settings: 'settings',
};

// Move the tabBarIcon function outside of the AppStack component
const getTabBarIcon = routeName => {
  const iconName = iconNames[routeName];

  return ({color, size}) => <Icon name={iconName} color={color} size={size} />;
};

const AppStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}>
      <Tab.Screen
        name="MesoCycle"
        component={MesoCycleStackNavigator}
        options={{
          tabBarIcon: getTabBarIcon('MesoCycle'),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: getTabBarIcon('Home'),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: getTabBarIcon('Profile'),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{
          tabBarIcon: getTabBarIcon('Settings'),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppStack;
