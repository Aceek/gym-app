import React, {useState, useRef} from 'react';
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
      cardIds: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7'],
    },
    {
      id: 'w2',
      title: 'Week 2',
      cardIds: ['d8', 'd9', 'd10', 'd11', 'd12', 'd13', 'd14'],
    },
    {
      id: 'w3',
      title: 'Week 3',
      cardIds: ['d15', 'd16', 'd17', 'd18', 'd19', 'd20', 'd21'],
    },
    {
      id: 'w4',
      title: 'Week 4',
      cardIds: ['d22', 'd23', 'd24', 'd25', 'd26', 'd27', 'd28'],
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
      columnId: 'w2',
      title: 'Day 2',
      content: 'Back, Biceps - 6 exercises',
    },
    // ... Add more cards for each day
  ]);

  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  const handleCardPress = (cardId, columnId) => {
    navigation.navigate('DayDetails', {weekId: columnId, dayId: cardId});
  };

  const addWeek = () => {
    const newWeekId = `w${weeks.length + 1}`;
    const newWeek = {
      id: newWeekId,
      title: `Week ${weeks.length + 1}`,
      cardIds: [],
    };
    setWeeks([...weeks, newWeek]);
  };

  const renderItem = ({item: week, index}) => (
    <View style={styles.columnContainer}>
      <Column
        id={week.id}
        title={week.title}
        cardIds={week.cardIds}
        cards={cards.filter(card => week.cardIds.includes(card.id))}
        onCardPress={handleCardPress}
      />
    </View>
  );

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
