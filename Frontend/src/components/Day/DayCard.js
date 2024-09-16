import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const DayCard = ({day, navigation}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ExerciseScreen', {dayId: day.id})}>
      <View style={styles.card}>
        <Text style={styles.cardText}>Day {day.number}</Text>
        <View style={styles.exerciseList}>
          {day.exercises.map((exercise, index) => (
            <Text key={index} style={styles.exerciseText}>
              {exercise}
            </Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exerciseList: {
    marginLeft: 10,
  },
  exerciseText: {
    fontSize: 16,
    color: '#666',
  },
});

export default DayCard;
