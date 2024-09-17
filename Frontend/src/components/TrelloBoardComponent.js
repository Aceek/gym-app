import React from 'react';
import {FlatList, StyleSheet, View, Dimensions} from 'react-native';
import Column from './Column';
import DayCard from './DayCard';
import ExerciseCard from './ExerciseCard';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const TrelloBoardComponent = ({
  data,
  type,
  onViewableItemsChanged,
  viewabilityConfig,
}) => {
  const renderItem = ({item}) => (
    <Column
      title={item.title}
      data={item.data}
      renderCard={cardItem =>
        type === 'day' ? (
          <DayCard
            day={cardItem}
            onPress={() => cardItem.onPress(cardItem.id, item.id)}
          />
        ) : (
          <ExerciseCard
            exercise={cardItem}
            onPress={() => cardItem.onPress(cardItem.id, item.id)}
            onUpdate={cardItem.onUpdate}
          />
        )
      }
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  flatListContent: {
    flexGrow: 1,
    justifyContent: 'flex-start', // Change this to align content to the top
  },
});

export default TrelloBoardComponent;
