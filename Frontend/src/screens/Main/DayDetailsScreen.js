// DayDetailsScreen.js

import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import TrelloBoardComponent from '../../components/Navigation/TrelloBoardComponent';
import ExerciseCard from '../../components/Cards/ExerciseCard';
import DotNavigation from '../../components/UI/DotNavigation';
import ExerciseCardModal from '../../components/Modals/ExerciseCardModal';
import helper from '../../helpers/helperTemplate';

const DayDetailsScreen = React.memo(({route}) => {
  const {mesocycleId, weekId, dayId} = route.params;
  const navigation = useNavigation();

  const [days, setDays] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    const week = helper.getWeekById(weekId);
    if (week) {
      const daysData = week.days.map(dayId => helper.getDayById(dayId));
      setDays(daysData);

      const exercisesData = [];
      daysData.forEach(day => {
        const dayExercises = day.exercises.map(exerciseId => {
          const exercise = helper.getExerciseById(exerciseId);
          const initialContent =
            exercise.initialContent || 'Weight: 0kg, Reps: 0, RPE: 0';
          return {...exercise, dayId: day.id, initialContent};
        });
        exercisesData.push(...dayExercises);
      });
      setExercises(exercisesData);
    }
  }, [weekId]);

  // Mettre le focus sur le jour cliqué
  useEffect(() => {
    if (days.length > 0) {
      const index = days.findIndex(day => day.id === dayId);
      if (index !== -1) {
        setCurrentDayIndex(index);
        updateHeaderTitle(index);
      }
    }
  }, [days, dayId, updateHeaderTitle]);

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

  const handleAddCard = useCallback(dayId => {
    const newExercise = {
      id: `e${Date.now()}`,
      dayId: dayId,
      title: 'New Exercise',
      initialContent: 'Weight: 0kg, Reps: 0, RPE: 0',
      weight: '0',
      reps: '0',
      rpe: '0',
    };
    setExercises(prevExercises => [...prevExercises, newExercise]);
  }, []);

  const handleRemoveCard = useCallback((dayId, exerciseId) => {
    setExercises(prevExercises =>
      prevExercises.filter(exercise => exercise.id !== exerciseId),
    );
  }, []);

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
            ? {...exercise, ...updatedExercise}
            : exercise,
        ),
      );
      handleCloseExerciseModal();
    },
    [selectedExercise, handleCloseExerciseModal],
  );

  const boardData = useMemo(
    () =>
      days.map(day => ({
        id: day.id,
        title: day.title,
        data: exercises.filter(exercise => exercise.dayId === day.id),
      })),
    [days, exercises],
  );

  const onViewableItemsChanged = useCallback(
    ({viewableItems}) => {
      if (viewableItems.length > 0) {
        const newIndex = viewableItems[0].index;
        setCurrentDayIndex(newIndex);
        updateHeaderTitle(newIndex);
      }
    },
    [updateHeaderTitle],
  );

  const renderExerciseCard = useCallback(
    (item, dayId) => (
      <ExerciseCard
        key={item.id}
        {...item}
        dayId={dayId}
        weekId={weekId}
        mesocycleId={mesocycleId}
        onRemove={() => handleRemoveCard(dayId, item.id)}
        onModify={() => handleOpenExerciseModal(item.id)}
      />
    ),
    [mesocycleId, weekId, handleRemoveCard, handleOpenExerciseModal],
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
        // initialColumnIndex={currentDayIndex} // Focus sur le jour cliqué
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
