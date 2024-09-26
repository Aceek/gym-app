// ExerciseDetailsScreen.js

import React, {useState, useRef, useCallback, useEffect, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import TrelloBoardComponent from '../../components/Navigation/TrelloBoardComponent';
import SetCard from '../../components/Cards/SetCard';
import SetCardModal from '../../components/Modals/SetCardModal';
import ExerciseNoteModal from '../../components/Modals/ExerciceNoteModal';
import DotNavigation from '../../components/UI/DotNavigation';
import helper from '../../helpers/helperTemplate';

const ExerciseDetailsScreen = React.memo(({route}) => {
  const {mesocycleId, weekId, dayId, exerciseId} = route.params;
  const navigation = useNavigation();

  const [exercises, setExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);

  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [selectedExerciseNote, setSelectedExerciseNote] = useState('');
  const [selectedExerciseForNote, setSelectedExerciseForNote] = useState(null);

  // Récupérer les exercices du jour avec les sets complets
  useEffect(() => {
    const day = helper.getDayById(dayId);
    if (day) {
      const exercisesData = day.exercises.map(exId => {
        const exercise = helper.getExerciseById(exId);
        // Récupérer les données complètes des sets pour l'exercice
        const sets = helper.getSetsForExercise(exId);
        return {...exercise, sets};
      });
      setExercises(exercisesData);
    }
  }, [dayId]);

  // Mettre le focus sur l'exercice cliqué
  useEffect(() => {
    if (exercises.length > 0) {
      const index = exercises.findIndex(ex => ex.id === exerciseId);
      if (index !== -1) {
        setCurrentExerciseIndex(index);
        updateHeaderTitle(index);
      }
    }
  }, [exercises, exerciseId, updateHeaderTitle]);

  const updateHeaderTitle = useCallback(
    index => {
      const currentExercise = exercises[index];
      if (currentExercise) {
        navigation.setOptions({
          title: `Exercise Details - ${currentExercise.title}`,
        });
      }
    },
    [exercises, navigation],
  );

  const handleOpenNoteModal = useCallback(
    exerciseId => {
      const exercise = exercises.find(ex => ex.id === exerciseId);
      setSelectedExerciseNote(exercise.note || '');
      setSelectedExerciseForNote(exerciseId);
      setNoteModalVisible(true);
    },
    [exercises],
  );

  const handleCloseNoteModal = useCallback(() => {
    setNoteModalVisible(false);
    setSelectedExerciseNote('');
    setSelectedExerciseForNote(null);
  }, []);

  const handleSaveNote = useCallback(
    note => {
      setExercises(prevExercises =>
        prevExercises.map(exercise =>
          exercise.id === selectedExerciseForNote
            ? {...exercise, note: note}
            : exercise,
        ),
      );
      handleCloseNoteModal();
    },
    [selectedExerciseForNote, handleCloseNoteModal],
  );

  const handleAddSet = useCallback(exerciseId => {
    const newSet = {
      id: `s${Date.now()}`,
      reps: 0,
      weight: 0,
      rpe: null,
    };
    setExercises(prevExercises =>
      prevExercises.map(exercise =>
        exercise.id === exerciseId
          ? {...exercise, sets: [...(exercise.sets || []), newSet]}
          : exercise,
      ),
    );
    return newSet;
  }, []);

  const handleRemoveSet = useCallback((exerciseId, setId) => {
    setExercises(prevExercises =>
      prevExercises.map(exercise =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.filter(set => set.id !== setId),
            }
          : exercise,
      ),
    );
  }, []);

  const handleOpenModal = useCallback((exerciseId, set) => {
    setSelectedExerciseId(exerciseId);
    setSelectedSet(set);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedSet(null);
    setSelectedExerciseId(null);
  }, []);

  const handleSaveSet = useCallback(
    updatedSet => {
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
    },
    [selectedExerciseId, selectedSet, handleCloseModal],
  );

  const boardData = useMemo(
    () =>
      exercises.map(exercise => ({
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
        data: exercise.sets || [],
      })),
    [exercises],
  );

  const onViewableItemsChanged = useCallback(
    ({viewableItems}) => {
      if (viewableItems.length > 0) {
        const newIndex = viewableItems[0].index;
        setCurrentExerciseIndex(newIndex);
        updateHeaderTitle(newIndex);
      }
    },
    [updateHeaderTitle],
  );

  const renderSetCard = useCallback(
    (item, exerciseId) => (
      <SetCard
        key={item.id}
        {...item}
        onRemove={() => handleRemoveSet(exerciseId, item.id)}
        onPress={() => handleOpenModal(exerciseId, item)}
        onModify={() => handleOpenModal(exerciseId, item)}
      />
    ),
    [handleRemoveSet, handleOpenModal],
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
        onHeaderPress={handleOpenNoteModal}
        initialColumnIndex={currentExerciseIndex} // Focus sur l'exercice cliqué
      />

      <View style={styles.navigation}>
        <DotNavigation
          currentIndex={currentExerciseIndex}
          total={exercises.length}
        />
      </View>

      <SetCardModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveSet}
        initialValues={
          selectedSet || {reps: 0, weight: 0, rpe: null, type: 'regular'}
        }
      />

      <ExerciseNoteModal
        visible={noteModalVisible}
        onClose={handleCloseNoteModal}
        onSave={handleSaveNote}
        initialNote={selectedExerciseNote}
      />
    </View>
  );
});

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
});

export default ExerciseDetailsScreen;
