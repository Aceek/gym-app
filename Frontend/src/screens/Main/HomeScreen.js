import React, {useContext, useState, useEffect} from 'react';
import {View, Text, Button, ScrollView} from 'react-native';
import {AuthContext} from '../../context/AuthContext';
import * as Keychain from 'react-native-keychain';
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY} from '@env';

const HomeScreen = () => {
  const {user, logout} = useContext(AuthContext);
  const [tokens, setTokens] = useState({accessToken: '', refreshToken: ''});

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const accessToken = await Keychain.getGenericPassword({
          service: ACCESS_TOKEN_KEY,
        });
        const refreshToken = await Keychain.getGenericPassword({
          service: REFRESH_TOKEN_KEY,
        });

        setTokens({
          accessToken: accessToken ? accessToken.password : '',
          refreshToken: refreshToken ? refreshToken.password : '',
        });
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
