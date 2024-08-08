import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {authenticateWithGoogle} from './api';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const loginWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signIn();
    const idToken = await GoogleSignin.getTokens().then(
      tokens => tokens.idToken,
    );

    const {accessToken, refreshToken, user} = await authenticateWithGoogle(
      idToken,
    );

    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    return user;
  } catch (error) {
    console.error('Error logging in with Google:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);

    await GoogleSignin.signOut();
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const getTokens = async () => {
  try {
    const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    return {accessToken, refreshToken};
  } catch (error) {
    console.error('Error getting tokens:', error);
    throw error;
  }
};
