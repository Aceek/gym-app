// App.jsx
import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, StyleSheet, Button} from 'react-native';
import axios from 'axios';
import {configureGoogleSignIn} from './src/googleSignInConfig';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const API_URL = 'http://192.168.1.7:5000';

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    configureGoogleSignIn();
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/test-db`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();

      // Obtain the authentication token
      const {idToken} = await GoogleSignin.getTokens();

      if (!idToken) {
        throw new Error('Failed to retrieve idToken');
      }

      // Send the token to the backend
      const response = await axios.post(`${API_URL}/auth/verify-token`, {
        token: idToken,
      });
      console.log('Server response:', response.data);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services not available or outdated');
      } else {
        console.error('Error during sign-in:', error);
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      console.log('User signed out');
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>{data ? JSON.stringify(data) : 'Loading...'}</Text>
      <GoogleSigninButton
        style={{width: 192, height: 48}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
      />
      <Button title="Sign Out" onPress={signOut} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
