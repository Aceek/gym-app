import React, {useContext} from 'react';
import {View, Text} from 'react-native';
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';
import {AuthContext} from '../../context/AuthContext';

const LoginScreen = () => {
  const {login} = useContext(AuthContext);

  const handleGoogleSignIn = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <View>
      <Text>Login Screen</Text>
      <GoogleSigninButton onPress={handleGoogleSignIn} />
    </View>
  );
};

export default LoginScreen;
