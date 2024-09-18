import React from 'react';
import {FlatList, StyleSheet, View, Dimensions, Button} from 'react-native';
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
      onHeaderPress={() => onHeaderPress(item.id)}>
      <Button title={'Add Card'} onPress={() => onAddCard(item.id)} />
    </Column>
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
    justifyContent: 'flex-start',
  },
});

export default TrelloBoardComponent;
