import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, StyleSheet} from 'react-native';
import axios from 'axios';
// import {API_URL} from '@env';

const API_URL = 'http://192.168.1.7:5000';

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log('API_URL:', API_URL);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/test-db`);
        setData(response.data);
        console.log('Data fetched:', response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text>{data ? JSON.stringify(data) : 'Loading...'}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
