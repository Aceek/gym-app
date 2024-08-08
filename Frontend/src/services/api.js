import axios from 'axios';
import {API_URL} from '@env';

const api = axios.create({
  baseURL: API_URL + '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
