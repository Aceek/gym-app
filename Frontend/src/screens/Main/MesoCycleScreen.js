import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Button,
  Dimensions,
  Text,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Column from '../../components/Column';

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

  const [cards, setCards] = useState([
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
    // ... Add more cards for each day
  ]);

  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  useEffect(() => {
    const newCards = [];
    weeks.forEach(week => {
      const weekCards = cards.filter(card => card.columnId === week.id);
      if (weekCards.length === 0) {
        newCards.push({
          id: `d${cards.length + newCards.length + 1}`,
          columnId: week.id,
          title: `Day ${cards.length + newCards.length + 1}`,
          content: 'Default workout day',
        });
      }
    });
    if (newCards.length > 0) {
      setCards(prevCards => [...prevCards, ...newCards]);
    }
  }, [weeks, cards]);

  const handleCardPress = (cardId, columnId) => {
    navigation.navigate('DayDetails', {weekId: columnId, dayId: cardId});
  };

  const addWeek = () => {
    const newWeekId = `w${weeks.length + 1}`;
    const newWeek = {
      id: newWeekId,
      title: `Week ${weeks.length + 1}`,
    };
    setWeeks(prevWeeks => [...prevWeeks, newWeek]);

    const newCard = {
      id: `d${cards.length + 1}`,
      columnId: newWeekId,
      title: `Day ${cards.length + 1}`,
      content: 'New workout day',
    };
    setCards(prevCards => [...prevCards, newCard]);
  };

  const renderItem = ({item: week}) => {
    const weekCards = cards.filter(card => card.columnId === week.id);
    return (
      <View style={styles.columnContainer}>
        <Column
          id={week.id}
          title={week.title}
          cards={weekCards}
          onCardPress={handleCardPress}
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
      <Button title="Add Week" onPress={addWeek} />
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
