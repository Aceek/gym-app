// ExerciseDetailsScreen.js

import React, {useState, useRef, useCallback, useEffect, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import TrelloBoardComponent from '../../components/Navigation/TrelloBoardComponent';
import SetCard from '../../components/Cards/SetCard';
import SetCardModal from '../../components/Modals/SetCardModal';
import ExerciseNoteModal from '../../components/Modals/ExerciceNoteModal';
import DotNavigation from '../../components/UI/DotNavigation';

const ExerciseDetailsScreen = React.memo(({route, navigation}) => {
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
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);

  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [selectedExerciseNote, setSelectedExerciseNote] = useState('');
  const [selectedExerciseForNote, setSelectedExerciseForNote] = useState(null);

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

  useEffect(() => {
    updateHeaderTitle(currentExerciseIndex);
  }, [currentExerciseIndex, updateHeaderTitle]);

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
          ? {...exercise, sets: [...exercise.sets, newSet]}
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
        data: exercise.sets,
      })),
    [exercises],
  );

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setCurrentExerciseIndex(newIndex);
      updateHeaderTitle(newIndex);
    }
  }).current;

  const renderSetCard = useCallback(
    (item, columnId) => (
      <SetCard
        key={item.id}
        {...item}
        onRemove={() => handleRemoveSet(columnId, item.id)}
        onPress={() => handleOpenModal(columnId, item)}
        onModify={() => handleOpenModal(columnId, item)}
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
        initialValues={selectedSet || {reps: 0, weight: 0, rpe: null}}
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
