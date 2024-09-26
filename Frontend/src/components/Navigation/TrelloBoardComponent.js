// TrelloBoardComponent.js

import React, {useCallback, useMemo, useRef, useEffect} from 'react';
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
    initialColumnIndex, // Ajoutez initialColumnIndex aux props
  }) => {
    const flatListRef = useRef(null); // Créez une référence au FlatList

    // Fonction pour le calcul de la position des éléments
    const getItemLayout = useCallback(
      (data, index) => ({
        length: SCREEN_WIDTH,
        offset: SCREEN_WIDTH * index,
        index,
      }),
      [],
    );

    // Défilement initial vers la colonne souhaitée
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
          ref={flatListRef} // Associez la référence au FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={getItemLayout} // Ajoutez getItemLayout
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
