import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const WeekCard = ({week, navigation}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('DayScreen', {weekId: week.id})}>
      <View style={styles.card}>
        <Text style={styles.cardText}>Week {week.number}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  cardText: {
    fontSize: 18,
  },
});

export default WeekCard;
