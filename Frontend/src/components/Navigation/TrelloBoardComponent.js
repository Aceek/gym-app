// TrelloBoardComponent.js

import React from 'react';
import {FlatList, StyleSheet, View, Dimensions} from 'react-native';
import Column from './Column';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const TrelloBoardComponent = ({
  data,
  renderCard,
  onViewableItemsChanged,
  viewabilityConfig,
  onAddCard,
  onHeaderPress,
}) => {
  const renderItem = ({item}) => (
    <Column
      title={item.title}
      data={item.data}
      headerInfo={item.headerInfo}
      renderCard={cardItem => renderCard(cardItem, item.id)}
      onHeaderPress={() => onHeaderPress && onHeaderPress(item.id)}
      onAddCard={() => onAddCard(item.id)}
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
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
        snapToAlignment="start"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 0,
  },
});

export default TrelloBoardComponent;
