import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ExerciseCard = ({exercise}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      <Text style={styles.details}>
        Weight: {exercise.weight}kg | Reps: {exercise.reps} | Sets:{' '}
        {exercise.sets}
      </Text>
    </View>
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
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  details: {
    fontSize: 16,
    color: '#666',
  },
});

export default ExerciseCard;
