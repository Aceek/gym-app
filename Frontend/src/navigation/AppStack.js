import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/Main/HomeScreen';
import ProfileScreen from '../screens/Main/ProfileScreen';
import SettingsScreen from '../screens/Main/SettingsScreen';
import MesoCycleScreen from '../screens/Main/MesoCycleScreen';
import DayDetailsScreen from '../screens/Main/DayDetailsScreen';

const HomeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const MesoCycleStack = createNativeStackNavigator();

const MesoCycleStackNavigator = () => (
  <MesoCycleStack.Navigator screenOptions={{headerShown: false}}>
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
  </MesoCycleStack.Navigator>
);

const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{headerShown: false}}>
    <HomeStack.Screen name="HomeStackScreen" component={HomeScreen} />
  </HomeStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{headerShown: false}}>
    <ProfileStack.Screen name="ProfileStackScreen" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

const SettingsStackNavigator = () => (
  <SettingsStack.Navigator screenOptions={{headerShown: false}}>
    <SettingsStack.Screen
      name="SettingsStackScreen"
      component={SettingsScreen}
    />
  </SettingsStack.Navigator>
);

const Tab = createBottomTabNavigator();

const AppStack = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="MesoCycle" component={MesoCycleStackNavigator} />
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
      <Tab.Screen name="Settings" component={SettingsStackNavigator} />
    </Tab.Navigator>
  );
};

export default AppStack;
