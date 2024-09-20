// TrelloBoardComponent.js

import React, {useCallback, useMemo} from 'react';
import {FlatList, StyleSheet, View, Dimensions} from 'react-native';
import Column from './Column';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const TrelloBoardComponent = React.memo(
  ({
    data,
    renderCard,
    onViewableItemsChanged,
    viewabilityConfig,
    onAddCard,
    onHeaderPress,
  }) => {
    const renderItem = useCallback(
      ({item}) => (
        <Column
          title={item.title}
          data={item.data}
          headerInfo={item.headerInfo}
          renderCard={cardItem => renderCard(cardItem, item.id)}
          onHeaderPress={() => onHeaderPress && onHeaderPress(item.id)}
          onAddCard={() => onAddCard(item.id)}
        />
      ),
      [renderCard, onHeaderPress, onAddCard],
    );

    const keyExtractor = useCallback(item => item.id, []);

    const flatListProps = useMemo(
      () => ({
        horizontal: true,
        pagingEnabled: true,
        showsHorizontalScrollIndicator: false,
        contentContainerStyle: styles.flatListContent,
        snapToInterval: SCREEN_WIDTH,
        decelerationRate: 'fast',
        snapToAlignment: 'start',
      }),
      [],
    );

    return (
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          {...flatListProps}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 0,
  },
});

export default TrelloBoardComponent;
