import React, {useContext, useState, useEffect} from 'react';
import {View, Text, Button, ScrollView} from 'react-native';
import {AuthContext} from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const {user, logout} = useContext(AuthContext);
  const [tokens, setTokens] = useState({accessToken: '', refreshToken: ''});

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('access_token');
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        setTokens({accessToken, refreshToken});
      } catch (error) {
        console.error('Error fetching tokens:', error);
      }
    };

    fetchTokens();
  }, []);

  return (
    <ScrollView>
      <View>
        <Text>Welcome, {user.displayName}!</Text>
        <Text>Email: {user.email}</Text>
        <Text>Access Token: {tokens.accessToken}</Text>
        <Text>Refresh Token: {tokens.refreshToken}</Text>
        <Button title="Logout" onPress={logout} />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
