import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {refreshTokenFunc} from './authService';
import {ACCESS_TOKEN_KEY} from '@env';

const setupAxiosInterceptors = logout => {
  // Intercepteur pour ajouter le token d'accès à chaque requête
  axios.interceptors.request.use(
    async config => {
      const accessToken = await Keychain.getGenericPassword({
        service: ACCESS_TOKEN_KEY,
      });
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken.password}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  // Intercepteur pour gérer les erreurs 401 (Unauthorized)
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

export default setupAxiosInterceptors;
