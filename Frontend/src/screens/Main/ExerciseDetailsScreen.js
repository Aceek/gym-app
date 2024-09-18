import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import TrelloBoardComponent from '../../components/TrelloBoardComponent';
import SetCard from '../../components/SetCard'; // Composant pour les sets

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const ExerciseDetailsScreen = ({route, navigation}) => {
  // Fake data pour tester
  const initialExercises = [
    {
      id: 'e1',
      title: 'Bench Press',
      weight: '80',
      reps: '5',
      rpe: '8',
      sets: [
        {id: 's1', reps: '5', weight: '80'},
        {id: 's2', reps: '5', weight: '82.5'},
      ],
    },
    {
      id: 'e2',
      title: 'Squat',
      weight: '100',
      reps: '5',
      rpe: '8',
      sets: [
        {id: 's3', reps: '5', weight: '100'},
        {id: 's4', reps: '4', weight: '110'},
      ],
    },
  ];

  const [exercises, setExercises] = useState(initialExercises);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const flatListRef = useRef(null);

  // Méthode pour ajouter un nouveau SetCard à un exercice
  const handleAddSet = exerciseId => {
    const newSet = {
      id: `s${Date.now()}`,
      reps: '',
      weight: '',
    };
    setExercises(prevExercises =>
      prevExercises.map(exercise =>
        exercise.id === exerciseId
          ? {...exercise, sets: [...exercise.sets, newSet]}
          : exercise,
      ),
    );
    return newSet;
  };

  // Méthode pour supprimer un SetCard
  const handleRemoveSet = (exerciseId, setId) => {
    setExercises(prevExercises =>
      prevExercises.map(exercise =>
        exercise.id === exerciseId
          ? {...exercise, sets: exercise.sets.filter(set => set.id !== setId)}
          : exercise,
      ),
    );
  };

  // Préparer les données pour le TrelloBoardComponent
  const boardData = exercises.map(exercise => ({
    id: exercise.id,
    title: exercise.title,
    headerInfo: {
      'Poids cible': `${exercise.weight} kg`,
      'Répétitions cibles': exercise.reps,
      'RPE cible': exercise.rpe,
    },
    data: exercise.sets, // Les sets sont les cartes dans chaque colonne
  }));

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentSetIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <TrelloBoardComponent
        data={boardData} // Affiche les sets des exercices avec les informations d'en-tête
        CardComponent={SetCard} // Utilisation de SetCard comme composant de carte
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{itemVisiblePercentThreshold: 50}}
        onAddCard={handleAddSet} // Gérer l'ajout de sets
        onRemoveCard={handleRemoveSet} // Gérer la suppression de sets
      />
      <View style={styles.navigation}>
        <Text style={styles.navigationText}>
          Exercice {currentSetIndex + 1} / {exercises.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  navigationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExerciseDetailsScreen;
