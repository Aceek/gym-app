// DayDetailsScreen.js

import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import TrelloBoardComponent from '../../components/Navigation/TrelloBoardComponent';
import ExerciseCard from '../../components/Cards/ExerciseCard';
import DotNavigation from '../../components/UI/DotNavigation';
import ExerciseCardModal from '../../components/Modals/ExerciseCardModal';

const DayDetailsScreen = React.memo(({route}) => {
  const {dayId} = route.params;
  const navigation = useNavigation();

  const days = useMemo(
    () => [
      {id: 'd1', title: 'Monday'},
      {id: 'd2', title: 'Tuesday'},
      {id: 'd3', title: 'Wednesday'},
      {id: 'd4', title: 'Thursday'},
      {id: 'd5', title: 'Friday'},
      {id: 'd6', title: 'Saturday'},
      {id: 'd7', title: 'Sunday'},
    ],
    [],
  );

  const [exercises, setExercises] = useState([
    {
      id: 'e1',
      columnId: 'd1',
      title: 'Bench Press',
      initialContent: 'Weight: 80kg, Reps: 5, RPE: 8',
      weight: '80',
      reps: '5',
      rpe: '8',
    },
    {
      id: 'e2',
      columnId: 'd1',
      title: 'Incline DB Press',
      initialContent: 'Weight: 30kg, Reps: 8, RPE: 7',
      weight: '30',
      reps: '8',
      rpe: '7',
    },
    {
      id: 'e3',
      columnId: 'd2',
      title: 'Squat',
      initialContent: 'Weight: 100kg, Reps: 5, RPE: 8',
      weight: '100',
      reps: '5',
      rpe: '8',
    },
    // ... Ajoutez plus d'exercices pour chaque jour
  ]);

  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const updateHeaderTitle = useCallback(
    index => {
      const currentDay = days[index];
      if (currentDay) {
        navigation.setOptions({
          title: `Day Details - ${currentDay.title}`,
        });
      }
    },
    [days, navigation],
  );

  useEffect(() => {
    const initialIndex = days.findIndex(day => day.id === dayId);
    if (initialIndex !== -1) {
      setCurrentDayIndex(initialIndex);
      updateHeaderTitle(initialIndex);
    }
  }, [dayId, days, updateHeaderTitle]);

  useEffect(() => {
    updateHeaderTitle(currentDayIndex);
  }, [currentDayIndex, updateHeaderTitle]);

  const handleAddCard = useCallback(columnId => {
    const newExercise = {
      id: `e${Date.now()}`,
      columnId: columnId,
      title: 'New Exercise',
      initialContent: 'Weight: 0kg, Reps: 0, RPE: 0',
      weight: '0',
      reps: '0',
      rpe: '0',
    };
    setExercises(prevExercises => [...prevExercises, newExercise]);
  }, []);

  const handleRemoveCard = useCallback((columnId, cardId) => {
    setExercises(prevExercises =>
      prevExercises.filter(exercise => exercise.id !== cardId),
    );
  }, []);

  const boardData = useMemo(
    () =>
      days.map(day => ({
        id: day.id,
        title: day.title,
        data: exercises.filter(exercise => exercise.columnId === day.id),
      })),
    [days, exercises],
  );

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setCurrentDayIndex(newIndex);
      updateHeaderTitle(newIndex);
    }
  }).current;

  // Gestion du Modal pour Modifier un Exercice
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const handleOpenExerciseModal = useCallback(
    exerciseId => {
      const exercise = exercises.find(ex => ex.id === exerciseId);
      if (exercise) {
        setSelectedExercise(exercise);
        setExerciseModalVisible(true);
      }
    },
    [exercises],
  );

  const handleCloseExerciseModal = useCallback(() => {
    setExerciseModalVisible(false);
    setSelectedExercise(null);
  }, []);

  const handleSaveExercise = useCallback(
    updatedExercise => {
      setExercises(prevExercises =>
        prevExercises.map(exercise =>
          exercise.id === selectedExercise?.id
            ? {
                ...exercise,
                ...updatedExercise,
                initialContent: `Weight: ${updatedExercise.weight}kg, Reps: ${updatedExercise.reps}, RPE: ${updatedExercise.rpe}`,
              }
            : exercise,
        ),
      );
      handleCloseExerciseModal();
    },
    [selectedExercise, handleCloseExerciseModal],
  );

  const renderExerciseCard = useCallback(
    (item, columnId) => (
      <ExerciseCard
        key={item.id}
        {...item}
        onRemove={() => handleRemoveCard(columnId, item.id)}
        onModify={() => handleOpenExerciseModal(item.id)}
      />
    ),
    [handleRemoveCard, handleOpenExerciseModal],
  );

  return (
    <View style={styles.container}>
      <TrelloBoardComponent
        data={boardData}
        renderCard={renderExerciseCard}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{itemVisiblePercentThreshold: 50}}
        onAddCard={handleAddCard}
        onRemoveCard={handleRemoveCard}
      />
      <View style={styles.navigation}>
        <DotNavigation currentIndex={currentDayIndex} total={days.length} />
      </View>

      {/* ExerciseCardModal */}
      <ExerciseCardModal
        visible={exerciseModalVisible}
        onClose={handleCloseExerciseModal}
        onSave={handleSaveExercise}
        initialValues={
          selectedExercise
            ? {
                title: selectedExercise.title,
                weight: parseFloat(selectedExercise.weight),
                reps: parseInt(selectedExercise.reps, 10),
                rpe: selectedExercise.rpe
                  ? parseInt(selectedExercise.rpe, 10)
                  : null,
              }
            : {title: '', weight: 0, reps: 0, rpe: null}
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default DayDetailsScreen;
