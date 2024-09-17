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
      content: 'Weight: 80kg, Max RPE: 8',
    },
    {
      id: 'e2',
      columnId: 'd1',
      title: 'Incline DB Press',
      content: 'Weight: 30kg, Max RPE: 7',
    },
    {
      id: 'e3',
      columnId: 'd2',
      title: 'Squat',
      content: 'Weight: 100kg, Max RPE: 8',
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

  useEffect(() => {
    const newExercises = [];
    days.forEach(day => {
      const dayExercises = exercises.filter(
        exercise => exercise.columnId === day.id,
      );
      if (dayExercises.length === 0) {
        newExercises.push({
          id: `e${exercises.length + newExercises.length + 1}`,
          columnId: day.id,
          title: 'New Exercise',
          content: 'Add details here',
        });
      }
    });
    if (newExercises.length > 0) {
      setExercises(prevExercises => [...prevExercises, ...newExercises]);
    }
  }, [days, exercises]);

  const handleExercisePress = (exerciseId, dayId) => {
    console.log(`Edit exercise ${exerciseId} for day ${dayId}`);
    // Cette fonction sera gérée par le composant ExerciseCard
  };

  const handleExerciseUpdate = (exerciseId, dayId, updatedData) => {
    setExercises(prevExercises =>
      prevExercises.map(exercise =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              content: `Weight: ${updatedData.weight}kg, Reps: ${updatedData.reps}, RPE: ${updatedData.rpe}`,
            }
          : exercise,
      ),
    );
  };

  const boardData = days.map(day => ({
    id: day.id,
    title: day.title,
    data: exercises
      .filter(exercise => exercise.columnId === day.id)
      .map(exercise => ({
        ...exercise,
        onPress: () => handleExercisePress(exercise.id, day.id),
        onUpdate: updatedData =>
          handleExerciseUpdate(exercise.id, day.id, updatedData),
      })),
  }));

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentDayIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <TrelloBoardComponent
        data={boardData}
        type="exercise"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{itemVisiblePercentThreshold: 50}}
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
