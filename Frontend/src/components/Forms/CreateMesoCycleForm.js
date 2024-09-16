import React, {useState} from 'react';
import {View, TextInput, Button, Text, StyleSheet} from 'react-native';

const CreateMesoCycleForm = ({setMesocycles}) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');

  const handleCreateMesoCycle = () => {
    const newMesoCycle = {
      id: Math.floor(Math.random() * 1000), // ID temporaire
      name,
      duration,
    };

    // Simuler l'ajout du mesocycle (remplacer par une requête API si besoin)
    setMesocycles(prev => [...prev, newMesoCycle]);
  };

  return (
    <View>
      <Text>Create a New MesoCycle</Text>
      <TextInput
        placeholder="MesoCycle Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Duration (weeks)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Create" onPress={handleCreateMesoCycle} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    marginBottom: 10,
  },
});

export default CreateMesoCycleForm;
