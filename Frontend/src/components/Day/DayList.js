import React from 'react';
import {View, StyleSheet} from 'react-native';
import DayCard from './DayCard';

const DayList = ({days, navigation}) => {
  return (
    <View style={styles.container}>
      {days.map(day => (
        <DayCard key={day.id} day={day} navigation={navigation} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default DayList;
