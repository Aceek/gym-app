import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet} from 'react-native';

const CreateExerciseForm = ({dayId, setExercises, setShowForm}) => {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');

  const handleCreateExercise = () => {
    const newExercise = {
      id: Math.floor(Math.random() * 1000), // ID temporaire
      name,
      weight: parseInt(weight),
      reps: parseInt(reps),
      sets: parseInt(sets),
    };

    // Simuler l'ajout de l'exercice (remplacer par une requête API si besoin)
    setExercises(prev => [...prev, newExercise]);
    setShowForm(false);
  };

  return (
    <View style={styles.form}>
      <TextInput
        placeholder="Exercise Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Reps"
        value={reps}
        onChangeText={setReps}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Sets"
        value={sets}
        onChangeText={setSets}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Add Exercise" onPress={handleCreateExercise} />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default CreateExerciseForm;
