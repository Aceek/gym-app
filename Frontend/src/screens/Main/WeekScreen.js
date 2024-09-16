import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import WeekList from '../../components/week/WeekList';

const WeekScreen = ({route, navigation}) => {
  const {mesocycleId} = route.params;
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    const fetchWeeks = async () => {
      const data = [
        {id: 1, number: 1},
        {id: 2, number: 2},
        {id: 3, number: 3},
      ];
      setWeeks(data);
    };

    fetchWeeks();
  }, [mesocycleId]);

  return (
    <View>
      {weeks.length > 0 ? (
        <WeekList weeks={weeks} navigation={navigation} />
      ) : (
        <Text>No weeks available</Text>
      )}
    </View>
  );
};

export default WeekScreen;
