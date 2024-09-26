// ExerciseDetailsScreen.js

import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import TrelloBoardComponent from '../../components/Navigation/TrelloBoardComponent';
import SetCard from '../../components/Cards/SetCard';
import SetCardModal from '../../components/Modals/SetCardModal';
import ExerciseNoteModal from '../../components/Modals/ExerciceNoteModal';
import DotNavigation from '../../components/UI/DotNavigation';
import helper from '../../helpers/helperTemplate';

const ExerciseDetailsScreen = ({route}) => {
  const {dayId, exerciseId} = route.params;
  const navigation = useNavigation();

  const [exercises, setExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [selectedExerciseNote, setSelectedExerciseNote] = useState('');

  useEffect(() => {
    const day = helper.getDayById(dayId);
    if (day) {
      const exercisesData = day.exercises.map(exId => {
        const exercise = helper.getExerciseById(exId);
        const sets = helper.getSetsForExercise(exId);
        return {...exercise, sets};
      });
      setExercises(exercisesData);
    }
  }, [dayId]);

  useEffect(() => {
    const index = exercises.findIndex(ex => ex.id === exerciseId);
    if (index !== -1) {
      setCurrentExerciseIndex(index);
      const currentExercise = exercises[index];
      if (currentExercise) {
        navigation.setOptions({
          title: `Exercise Details - ${currentExercise.title}`,
        });
      }
    }
  }, [exercises, exerciseId, navigation]);

  const handleOpenNoteModal = useCallback(
    exId => {
      const exercise = exercises.find(ex => ex.id === exId);
      setSelectedExerciseNote(exercise.note || '');
      setSelectedExerciseId(exId);
      setNoteModalVisible(true);
    },
    [exercises],
  );

  const handleCloseNoteModal = useCallback(() => {
    setNoteModalVisible(false);
    setSelectedExerciseNote('');
    setSelectedExerciseId(null);
  }, []);

  const handleSaveNote = useCallback(
    note => {
      setExercises(prevExercises =>
        prevExercises.map(exercise =>
          exercise.id === selectedExerciseId ? {...exercise, note} : exercise,
        ),
      );
      handleCloseNoteModal();
    },
    [selectedExerciseId, handleCloseNoteModal],
  );

  const handleAddSet = useCallback(exIdSet => {
    const newSet = {
      id: `s${Date.now()}`,
      reps: 0,
      weight: 0,
      rpe: null,
    };
    setExercises(prevExercises =>
      prevExercises.map(exercise =>
        exercise.id === exIdSet
          ? {...exercise, sets: [...(exercise.sets || []), newSet]}
          : exercise,
      ),
    );
  }, []);

  const handleRemoveSet = useCallback((exIdSet, setId) => {
    setExercises(prevExercises =>
      prevExercises.map(exercise =>
        exercise.id === exIdSet
          ? {
              ...exercise,
              sets: exercise.sets.filter(set => set.id !== setId),
            }
          : exercise,
      ),
    );
  }, []);

  const handleOpenModal = useCallback((exIdModal, set) => {
    setSelectedExerciseId(exIdModal);
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
        const currentExercise = exercises[newIndex];
        if (currentExercise) {
          navigation.setOptions({
            title: `Exercise Details - ${currentExercise.title}`,
          });
        }
      }
    },
    [exercises, navigation],
  );

  const renderSetCard = useCallback(
    (item, exId) => (
      <SetCard
        key={item.id}
        {...item}
        onRemove={() => handleRemoveSet(exId, item.id)}
        onPress={() => handleOpenModal(exId, item)}
        onModify={() => handleOpenModal(exId, item)}
      />
    ),
    [handleRemoveSet, handleOpenModal],
  );

  return (
    <View style={styles.container}>
      <TrelloBoardComponent
        data={boardData}
        renderCard={(item, columnId) => renderSetCard(item, columnId)}
        onViewableItemsChanged={onViewableItemsChanged}
        onAddCard={handleAddSet}
        onHeaderPress={handleOpenNoteModal}
        initialColumnIndex={currentExerciseIndex}
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
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default ExerciseDetailsScreen;
