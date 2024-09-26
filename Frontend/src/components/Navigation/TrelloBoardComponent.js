// TrelloBoardComponent.js

import React, {useCallback, useMemo, useRef, useEffect} from 'react';
import {FlatList, StyleSheet, View, Dimensions} from 'react-native';
import Column from './Column';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const TrelloBoardComponent = ({
  data,
  renderCard,
  onViewableItemsChanged,
  onAddCard,
  onHeaderPress,
  initialColumnIndex,
}) => {
  const flatListRef = useRef(null);

  const getItemLayout = useCallback(
    (_, index) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    }),
    [],
  );

  useEffect(() => {
    if (
      flatListRef.current &&
      initialColumnIndex != null &&
      initialColumnIndex >= 0 &&
      initialColumnIndex < data.length
    ) {
      flatListRef.current.scrollToIndex({
        index: initialColumnIndex,
        animated: false,
        viewPosition: 0,
      });
    }
  }, [initialColumnIndex, data.length]);

  const renderItem = useCallback(
    ({item}) => (
      <Column
        data={item.data}
        headerInfo={item.headerInfo}
        renderCard={cardItem => renderCard(cardItem, item.id)}
        onHeaderPress={() => onHeaderPress && onHeaderPress(item.id)}
        onAddCard={() => onAddCard(item.id)}
      />
    ),
    [renderCard, onHeaderPress, onAddCard],
  );

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
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        getItemLayout={getItemLayout}
        {...flatListProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  flatListContent: {paddingHorizontal: 0},
});

export default TrelloBoardComponent;
