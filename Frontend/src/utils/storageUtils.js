import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY} from '@env';

export const storeTokensAndUser = async (accessToken, refreshToken, user) => {
  try {
    await setTokenInKeychain(ACCESS_TOKEN_KEY, accessToken);
    await setTokenInKeychain(REFRESH_TOKEN_KEY, refreshToken);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error storing tokens and user:', error);
    throw error;
  }
};

export const clearStoredTokensAndUser = async () => {
  try {
    await Keychain.resetGenericPassword({service: ACCESS_TOKEN_KEY});
    await Keychain.resetGenericPassword({service: REFRESH_TOKEN_KEY});
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error clearing stored tokens and user:', error);
    throw error;
  }
};

export const getStoredUser = async () => {
  try {
    const storedUser = await AsyncStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Error getting stored user:', error);
    throw error;
  }
};

export const getTokenFromKeychain = async key => {
  try {
    const token = await Keychain.getGenericPassword({service: key});
    return token ? token.password : null;
  } catch (error) {
    console.error(`Error getting token (${key}) from Keychain:`, error);
    throw error;
  }
};

export const setTokenInKeychain = async (key, token) => {
  try {
    await Keychain.setGenericPassword(key, token, {service: key});
  } catch (error) {
    console.error(`Error setting token (${key}) in Keychain:`, error);
    throw error;
  }
};

export const storeTimerData = async (storageKey, timeRemaining) => {
  try {
    await AsyncStorage.setItem(`${storageKey}_timer`, timeRemaining.toString());
    await AsyncStorage.setItem(
      `${storageKey}_lastUpdate`,
      Date.now().toString(),
    );
  } catch (error) {
    console.error('Error storing timer data:', error);
    throw error;
  }
};

export const getStoredTimerData = async storageKey => {
  try {
    const storedTime = await AsyncStorage.getItem(`${storageKey}_timer`);
    const lastUpdate = await AsyncStorage.getItem(`${storageKey}_lastUpdate`);
    return {storedTime, lastUpdate};
  } catch (error) {
    console.error('Error getting stored timer data:', error);
    throw error;
  }
};

export const clearStoredTimerData = async storageKey => {
  try {
    await AsyncStorage.removeItem(`${storageKey}_timer`);
    await AsyncStorage.removeItem(`${storageKey}_lastUpdate`);
  } catch (error) {
    console.error('Error clearing timer data:', error);
    throw error;
  }
};
