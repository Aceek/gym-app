import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import TrelloBoardComponent from '../../components/Navigation/TrelloBoardComponent';
import DayCard from '../../components/Cards/DayCard';
import DotNavigation from '../../components/UI/DotNavigation';

const MesoCycleScreen = () => {
  const [weeks] = useState([
    {id: 'w1', title: 'Week 1'},
    {id: 'w2', title: 'Week 2'},
    {id: 'w3', title: 'Week 3'},
    {id: 'w4', title: 'Week 4'},
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
    // ... Add more days for each week
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
          title: `Day ${dayCount + 1}`,
          content: 'Default workout day',
        };
        newDays.push(newDay);
      }
    });

    if (newDays.length > 0) {
      setDays(prevDays => [...prevDays, ...newDays]);
    }
  }, [weeks, days]);

  const handleAddCard = columnId => {
    const newCard = {
      id: `d${Date.now()}`,
      columnId: columnId,
      title: `Day ${days.filter(day => day.columnId === columnId).length + 1}`,
      content: 'New day description',
    };
    setDays(prevDays => [...prevDays, newCard]);
  };

  const handleRemoveCard = (columnId, cardId) => {
    setDays(prevDays => prevDays.filter(day => day.id !== cardId));
  };

  const boardData = weeks.map(week => ({
    id: week.id,
    title: week.title,
    data: days.filter(day => day.columnId === week.id),
  }));

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentWeekIndex(viewableItems[0].index);
    }
  }).current;

  const renderDayCard = (item, columnId) => (
    <DayCard
      {...item}
      onRemove={() => handleRemoveCard(columnId, item.id)}
      // Add any other necessary props or handlers
    />
  );

  return (
    <View style={styles.container}>
      <TrelloBoardComponent
        data={boardData}
        renderCard={renderDayCard}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{itemVisiblePercentThreshold: 50}}
        onAddCard={handleAddCard}
        onRemoveCard={handleRemoveCard}
      />
      <View style={styles.navigation}>
        <DotNavigation currentIndex={currentWeekIndex} total={weeks.length} />
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
});

export default MesoCycleScreen;
