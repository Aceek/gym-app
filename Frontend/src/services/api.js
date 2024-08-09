import axios from 'axios';
import {API_URL} from '@env';
import {refreshTokenFunc} from './authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = axios.create({
  baseURL: API_URL + '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setupAxiosInterceptorsJwt = () => {
  axios.interceptors.request.use(
    async config => {
      const accessToken = await AsyncStorage.getItem('access_token');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );
};

export const setupAxiosInterceptors401 = logout => {
  axios.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await refreshTokenFunc();
          axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (err) {
          logout();
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    },
  );
};

export const authenticateWithGoogle = async idToken => {
  try {
    const response = await api.post('/auth/google', {token: idToken});
    return response.data;
  } catch (error) {
    console.error('Error authenticating with Google:', error);
    throw error;
  }
};

export default api;
