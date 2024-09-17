import React, {useState, useRef, useEffect, useMemo} from 'react';
import {View, FlatList, StyleSheet, Dimensions, Text} from 'react-native';
import Column from '../../components/Column';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const DayDetailsScreen = ({route}) => {
  const {weekId, dayId} = route.params;
  const flatListRef = useRef(null);

  // Mock data for demonstration purposes
  const days = useMemo(
    () => [
      {id: 'd1', title: 'Monday', cardIds: ['e1', 'e2', 'e3']},
      {id: 'd2', title: 'Tuesday', cardIds: ['e4', 'e5', 'e6']},
      {id: 'd3', title: 'Wednesday', cardIds: ['e7', 'e8', 'e9']},
      {id: 'd4', title: 'Thursday', cardIds: ['e10', 'e11', 'e12']},
      {id: 'd5', title: 'Friday', cardIds: ['e13', 'e14', 'e15']},
      {id: 'd6', title: 'Saturday', cardIds: ['e16', 'e17']},
      {id: 'd7', title: 'Sunday', cardIds: []},
    ],
    [],
  ); // Empty dependency array as this data is static

  const exercises = useMemo(
    () => [
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
        columnId: 'd1',
        title: 'Tricep Pushdown',
        content: 'Weight: 25kg, Max RPE: 8',
      },
      // ... Add more exercises for each day
    ],
    [],
  ); // Empty dependency array as this data is static

  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  useEffect(() => {
    const initialIndex = days.findIndex(day => day.id === dayId);
    if (initialIndex !== -1) {
      setCurrentDayIndex(initialIndex);
      flatListRef.current?.scrollToIndex({
        index: initialIndex,
        animated: false,
      });
    }
  }, [dayId, days]);

  const handleExercisePress = (exerciseId, dayId) => {
    console.log(`Edit exercise ${exerciseId} for day ${dayId}`);
    // Implement exercise editing logic here
  };

  const renderItem = ({item: day}) => (
    <View style={styles.columnContainer}>
      <Column
        id={day.id}
        title={day.title}
        cardIds={day.cardIds}
        cards={exercises.filter(exercise => day.cardIds.includes(exercise.id))}
        onCardPress={handleExercisePress}
      />
    </View>
  );

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentDayIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={days}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
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
  columnContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 10,
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
