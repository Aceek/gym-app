import React from 'react';
import {View, StyleSheet} from 'react-native';
import ExerciseCard from './ExerciseCard';

const ExerciseList = ({exercises}) => {
  return (
    <View style={styles.container}>
      {exercises.map(exercise => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default ExerciseList;
