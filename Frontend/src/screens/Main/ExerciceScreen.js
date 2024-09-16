import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import ExerciseList from '../../components/exercice/ExerciceList';
import CreateExerciseForm from '../../components/Forms/CreateExerciceForm';

const ExerciseScreen = ({route}) => {
  const {dayId} = route.params;
  const [exercises, setExercises] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Simuler la récupération des exercices pour un jour donné
    const fetchExercises = async () => {
      // Exemple de données simulées (à remplacer par un appel API ou Redux)
      const data = [
        {id: 1, name: 'Squat', weight: 100, reps: 10, sets: 3},
        {id: 2, name: 'Bench Press', weight: 80, reps: 8, sets: 3},
      ];
      setExercises(data);
    };

    fetchExercises();
  }, [dayId]);

  return (
    <View>
      {exercises.length > 0 ? (
        <ExerciseList exercises={exercises} />
      ) : (
        <Text>No exercises available</Text>
      )}

      <Button title="Add Exercise" onPress={() => setShowForm(!showForm)} />

      {showForm && (
        <CreateExerciseForm
          dayId={dayId}
          setExercises={setExercises}
          setShowForm={setShowForm}
        />
      )}
    </View>
  );
};

export default ExerciseScreen;
