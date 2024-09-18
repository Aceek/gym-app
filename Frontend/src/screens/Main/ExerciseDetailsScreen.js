import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import TrelloBoardComponent from '../../components/TrelloBoardComponent';
import SetCard from '../../components/SetCard';
import SetCardModal from '../../components/SetCardModal';
import ExerciseNoteModal from '../../components/ExerciceNoteModal';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const ExerciseDetailsScreen = ({route, navigation}) => {
  const initialExercises = [
    {
      id: 'e1',
      title: 'Bench Press',
      weight: '80',
      reps: '5',
      rpe: '8',
      sets: [
        {id: 's1', reps: 5, weight: 80, rpe: 8},
        {id: 's2', reps: 5, weight: 82.5, rpe: 8},
      ],
    },
    {
      id: 'e2',
      title: 'Squat',
      weight: '100',
      reps: '5',
      rpe: '8',
      sets: [
        {id: 's3', reps: 5, weight: 100, rpe: 8},
        {id: 's4', reps: 4, weight: 110, rpe: 9},
      ],
    },
  ];

  const [exercises, setExercises] = useState(initialExercises);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);

  // État pour le modal de note
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [selectedExerciseNote, setSelectedExerciseNote] = useState('');
  const [selectedExerciseForNote, setSelectedExerciseForNote] = useState(null);

  // Ouvrir le modal de note
  const handleOpenNoteModal = exerciseId => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    setSelectedExerciseNote(exercise.note || '');
    setSelectedExerciseForNote(exerciseId);
    setNoteModalVisible(true);
  };

  // Fermer le modal de note
  const handleCloseNoteModal = () => {
    setNoteModalVisible(false);
    setSelectedExerciseNote('');
    setSelectedExerciseForNote(null);
  };

  // Enregistrer la note
  const handleSaveNote = note => {
    setExercises(prevExercises =>
      prevExercises.map(exercise =>
        exercise.id === selectedExerciseForNote
          ? {...exercise, note: note}
          : exercise,
      ),
    );
    handleCloseNoteModal();
  };

  const handleAddSet = exerciseId => {
    const newSet = {
      id: `s${Date.now()}`,
      reps: 0,
      weight: 0,
      rpe: null,
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

  const handleRemoveSet = (exerciseId, setId) => {
    setExercises(prevExercises =>
      prevExercises.map(exercise =>
        exercise.id === exerciseId
          ? {...exercise, sets: exercise.sets.filter(set => set.id !== setId)}
          : exercise,
      ),
    );
  };

  const handleOpenModal = (exerciseId, set) => {
    setSelectedExerciseId(exerciseId);
    setSelectedSet(set);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedSet(null);
    setSelectedExerciseId(null);
  };

  const handleSaveSet = updatedSet => {
    setExercises(prevExercises =>
      prevExercises.map(exercise =>
        exercise.id === selectedExerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map(set =>
                set.id === selectedSet.id ? {...set, ...updatedSet} : set,
              ),
            }
          : exercise,
      ),
    );
    handleCloseModal();
  };

  const boardData = exercises.map(exercise => ({
    id: exercise.id,
    title: exercise.title,
    headerInfo: {
      'Poids cible': `${exercise.weight} kg`,
      'Répétitions cibles': exercise.reps,
      'RPE cible': exercise.rpe,
      Note: exercise.note
        ? exercise.note.length > 30
          ? exercise.note.substring(0, 27) + '...'
          : exercise.note
        : 'Aucune note (cliquez pour ajouter)',
    },
    data: exercise.sets,
  }));

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentSetIndex(viewableItems[0].index);
    }
  }).current;

  const renderSetCard = (item, columnId) => (
    <SetCard
      {...item}
      onRemove={() => handleRemoveSet(columnId, item.id)}
      onPress={() => handleOpenModal(columnId, item)}
    />
  );

  return (
    <View style={styles.container}>
      <TrelloBoardComponent
        data={boardData}
        renderCard={renderSetCard}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{itemVisiblePercentThreshold: 50}}
        onAddCard={handleAddSet}
        onRemoveCard={handleRemoveSet}
        onHeaderPress={handleOpenNoteModal} // Nouveau prop pour gérer le clic sur l'en-tête
      />

      <View style={styles.navigation}>
        <Text style={styles.navigationText}>
          Exercice {currentSetIndex + 1} / {exercises.length}
        </Text>
      </View>

      <SetCardModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveSet}
        initialValues={selectedSet || {reps: 0, weight: 0, rpe: null}}
      />

      {/* Modal pour la note de l'exercice */}
      <ExerciseNoteModal
        visible={noteModalVisible}
        onClose={handleCloseNoteModal}
        onSave={handleSaveNote}
        initialNote={selectedExerciseNote}
      />
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
