import axios from 'axios';
import {API_URL} from '@env';
import setupAxiosInterceptors from './axiosInterceptors';

export const api = axios.create({
  baseURL: API_URL + '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const initializeAxiosInterceptors = logout => {
  setupAxiosInterceptors(logout);
};

export const authenticateWithGoogle = async idToken => {
  try {
    console.log('Authenticating with Google');
    const response = await api.post('/auth/google', {token: idToken});
    return response.data.data;
  } catch (error) {
    console.error('Error authenticating with Google:', error);
    throw error;
  }
};

export default api;
