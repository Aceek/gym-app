import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import {AuthContext} from '../../context/AuthContext';

const HomeScreen = () => {
  const {user, logout} = useContext(AuthContext);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [protectedMessage, setProtectedMessage] = useState('');

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    // Supprime le refresh token après 30 secondes
    const timer = setTimeout(async () => {
      await AsyncStorage.removeItem('refresh_token');
      console.log('Refresh token removed after 30 seconds');
    }, 30000);

    return () => {
      clearInterval(countdown);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    // Effectuer des requêtes à la route protégée toutes les 15 secondes
    const interval = setInterval(() => {
      axios
        .get(`${API_URL}/api/protected/protected`)
        .then(response => {
          setProtectedMessage(response.data.message);
        })
        .catch(error => {
          console.error('Error fetching protected route:', error);
          // L'intercepteur Axios gérera la déconnexion en cas d'erreur 401
        });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Welcome, {user?.displayName}!</Text>
      <Text>Email: {user?.email}</Text>
      <Text>
        Time remaining before refresh token is removed: {timeRemaining}s
      </Text>
      <Text>{protectedMessage}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default HomeScreen;
