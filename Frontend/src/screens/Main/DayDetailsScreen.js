// DayDetailsScreen.js

import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import TrelloBoardComponent from '../../components/TrelloBoardComponent';
import ExerciseCard from '../../components/ExerciseCard';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const DayDetailsScreen = ({route}) => {
  const {weekId, dayId} = route.params;
  const flatListRef = useRef(null);

  const [days, setDays] = useState([
    {id: 'd1', title: 'Monday'},
    {id: 'd2', title: 'Tuesday'},
    {id: 'd3', title: 'Wednesday'},
    {id: 'd4', title: 'Thursday'},
    {id: 'd5', title: 'Friday'},
    {id: 'd6', title: 'Saturday'},
    {id: 'd7', title: 'Sunday'},
  ]);

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
    // ... Add more exercises for each day
  ]);

  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  useEffect(() => {
    const initialIndex = days.findIndex(day => day.id === dayId);
    if (initialIndex !== -1) {
      setCurrentDayIndex(initialIndex);
    }
  }, [dayId, days]);

  const handleAddCard = columnId => {
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
  };

  const handleRemoveCard = (columnId, cardId) => {
    setExercises(prevExercises =>
      prevExercises.filter(exercise => exercise.id !== cardId),
    );
  };

  const boardData = days.map(day => ({
    id: day.id,
    title: day.title,
    data: exercises.filter(exercise => exercise.columnId === day.id),
  }));

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentDayIndex(viewableItems[0].index);
    }
  }).current;

  const renderExerciseCard = (item, columnId) => (
    <ExerciseCard
      {...item}
      onRemove={() => handleRemoveCard(columnId, item.id)}
      // Add any other necessary props or handlers
    />
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
        <Text style={styles.navigationText}>
          {days[currentDayIndex]?.title} ({currentDayIndex + 1} / {days.length})
        </Text>
      </View>
    </View>
  );
};

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
  navigationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DayDetailsScreen;
