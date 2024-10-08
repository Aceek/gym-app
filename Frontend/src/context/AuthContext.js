import React, {createContext, useState, useEffect} from 'react';
import {
  loginWithGoogle,
  googleLogout,
  registerUser,
  LoginEmail,
} from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER_KEY} from '@env';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(USER_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (isGoogleLogin, userInfo) => {
    try {
      let userData = null;
      if (!isGoogleLogin) {
        userData = await LoginEmail(userInfo.email, userInfo.password);
      } else {
        userData = await loginWithGoogle();
      }

      setUser(userData);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await googleLogout();
      setUser(null);
      console.log('User logged out');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const register = async (email, password, displayName) => {
    try {
      await registerUser(email, password, displayName);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{user, isLoading, login, logout, register}}>
      {children}
    </AuthContext.Provider>
  );
};
