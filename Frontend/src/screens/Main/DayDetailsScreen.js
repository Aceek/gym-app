// DayDetailsScreen.js

import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import TrelloBoardComponent from '../../components/Navigation/TrelloBoardComponent';
import ExerciseCard from '../../components/Cards/ExerciseCard';
import DotNavigation from '../../components/UI/DotNavigation';
import ExerciseCardModal from '../../components/Modals/ExerciseCardModal';
import helper from '../../helpers/helperTemplate';

const DayDetailsScreen = ({route}) => {
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
      const daysData = week.days.map(id => helper.getDayById(id));
      setDays(daysData);

      const exercisesData = daysData.flatMap(day =>
        day.exercises.map(exerciseId => {
          const exercise = helper.getExerciseById(exerciseId);
          return {
            ...exercise,
            dayId: day.id,
            initialContent:
              exercise.initialContent || 'Weight: 0kg, Reps: 0, RPE: 0',
          };
        }),
      );
      setExercises(exercisesData);
    }
  }, [weekId]);

  useEffect(() => {
    const index = days.findIndex(d => d.id === dayId);
    if (index !== -1) {
      setCurrentDayIndex(index);
      const currentDay = days[index];
      if (currentDay) {
        navigation.setOptions({
          title: `Day Details - ${currentDay.title}`,
        });
      }
    }
  }, [days, dayId, navigation]);

  const handleAddCard = useCallback(selectedDayId => {
    const newExercise = {
      id: `e${Date.now()}`,
      dayId: selectedDayId,
      title: 'New Exercise',
      initialContent: 'Weight: 0kg, Reps: 0, RPE: 0',
      weight: '0',
      reps: '0',
      rpe: '0',
    };
    setExercises(prevExercises => [...prevExercises, newExercise]);
  }, []);

  const handleRemoveCard = useCallback(exerciseId => {
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
        const currentDay = days[newIndex];
        if (currentDay) {
          navigation.setOptions({
            title: `Day Details - ${currentDay.title}`,
          });
        }
      }
    },
    [days, navigation],
  );

  const renderExerciseCard = useCallback(
    item => (
      <ExerciseCard
        key={item.id}
        {...item}
        mesocycleId={mesocycleId}
        weekId={weekId}
        onRemove={() => handleRemoveCard(item.id)}
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
        onAddCard={handleAddCard}
        initialColumnIndex={currentDayIndex}
      />
      <View style={styles.navigation}>
        <DotNavigation currentIndex={currentDayIndex} total={days.length} />
      </View>
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
};

const styles = StyleSheet.create({
  container: {flex: 1},
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default DayDetailsScreen;
