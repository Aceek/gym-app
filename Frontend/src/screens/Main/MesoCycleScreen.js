import React, {useState, useRef, useEffect} from 'react';
import {View, FlatList, StyleSheet, Dimensions, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Column from '../../components/Column';
import DayCard from '../../components/DayCard';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const MesoCycleScreen = () => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const [weeks, setWeeks] = useState([
    {
      id: 'w1',
      title: 'Week 1',
    },
    {
      id: 'w2',
      title: 'Week 2',
    },
    {
      id: 'w3',
      title: 'Week 3',
    },
    {
      id: 'w4',
      title: 'Week 4',
    },
  ]);

  const [days, setDays] = useState([
    {
      id: 'd1',
      columnId: 'w1',
      title: 'Day 1',
      content: 'Chest, Triceps - 5 exercises',
    },
    {
      id: 'd2',
      columnId: 'w1',
      title: 'Day 2',
      content: 'Back, Biceps - 6 exercises',
    },
    {
      id: 'd3',
      columnId: 'w1',
      title: 'Day 3',
      content: 'Legs, Shoulders - 7 exercises',
    },
    // Add more days for week 1 if needed
  ]);

  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  useEffect(() => {
    const newDays = [];

    weeks.forEach((week, weekIndex) => {
      const weekDays = days.filter(day => day.columnId === week.id);
      const dayCount = weekDays.length > 0 ? weekDays.length : 0;

      if (dayCount === 0) {
        const newDay = {
          id: `d${weekIndex + 1}d1`,
          columnId: week.id,
          title: `Day 1`,
          content: 'Default workout day',
        };
        newDays.push(newDay);
      }
    });

    if (newDays.length > 0) {
      setDays(prevDays => [...prevDays, ...newDays]);
    }
  }, [weeks, days]);

  const handleDayPress = (dayId, columnId) => {
    navigation.navigate('DayDetails', {weekId: columnId, dayId: dayId});
  };

  const renderItem = ({item: week}) => {
    const weekDays = days.filter(day => day.columnId === week.id);
    return (
      <View style={styles.columnContainer}>
        <Column
          id={week.id}
          title={week.title}
          cards={weekDays.map(day => (
            <DayCard
              key={day.id}
              id={day.id}
              columnId={day.columnId}
              title={day.title}
              content={day.content}
              onPress={handleDayPress}
            />
          ))}
        />
      </View>
    );
  };

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentWeekIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={weeks}
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
          {currentWeekIndex + 1} / {weeks.length}
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

export default MesoCycleScreen;
