import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import DayList from '../../components/Day/DayList';

const DayScreen = ({route, navigation}) => {
  const {weekId} = route.params;
  const [days, setDays] = useState([]);

  useEffect(() => {
    // Simuler la récupération des jours pour une semaine donnée
    const fetchDays = async () => {
      // Exemple de données simulées (à remplacer par un appel API ou Redux)
      const data = [
        {id: 1, number: 1, exercises: ['Squat', 'Bench Press']},
        {id: 2, number: 2, exercises: ['Deadlift', 'Pull Ups']},
        {id: 3, number: 3, exercises: ['Overhead Press']},
      ];
      setDays(data);
    };

    fetchDays();
  }, [weekId]);

  return (
    <View>
      {days.length > 0 ? (
        <DayList days={days} navigation={navigation} />
      ) : (
        <Text>No days available</Text>
      )}
    </View>
  );
};

export default DayScreen;
