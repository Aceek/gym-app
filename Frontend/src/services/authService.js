import * as Keychain from 'react-native-keychain';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {authenticateWithGoogle, api} from './api';
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY} from '@env';

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

    await Keychain.setGenericPassword(ACCESS_TOKEN_KEY, accessToken, {
      service: ACCESS_TOKEN_KEY,
    });

    await Keychain.setGenericPassword(REFRESH_TOKEN_KEY, refreshToken, {
      service: REFRESH_TOKEN_KEY,
    });

    return user;
  } catch (error) {
    console.error('Error logging in with Google:', error);
    throw error;
  }
};

export const googleLogout = async () => {
  try {
    await GoogleSignin.signOut();

    await Keychain.resetGenericPassword({service: ACCESS_TOKEN_KEY});
    await Keychain.resetGenericPassword({service: REFRESH_TOKEN_KEY});
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const refreshTokenFunc = async () => {
  try {
    const refreshToken = await Keychain.getGenericPassword({
      service: REFRESH_TOKEN_KEY,
    });
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const response = await api.post('/token/refresh-token', {
      refreshToken: refreshToken.password,
    });
    const {accessToken} = response.data;

    await Keychain.setGenericPassword(ACCESS_TOKEN_KEY, accessToken, {
      service: ACCESS_TOKEN_KEY,
    });

    return accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

export const getTokens = async () => {
  try {
    const accessToken = await Keychain.getGenericPassword({
      service: ACCESS_TOKEN_KEY,
    });
    const refreshToken = await Keychain.getGenericPassword({
      service: REFRESH_TOKEN_KEY,
    });

    return {
      accessToken: accessToken ? accessToken.password : null,
      refreshToken: refreshToken ? refreshToken.password : null,
    };
  } catch (error) {
    console.error('Error getting tokens:', error);
    throw error;
  }
};
