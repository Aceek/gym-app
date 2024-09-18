// TrelloBoardComponent.js

import React from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Column from './Column';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
      <TouchableOpacity
        onPress={() => onAddCard(item.id)}
        style={styles.addIconContainer}>
        <Icon name="add-circle" size={40} color="#007AFF" />
      </TouchableOpacity>
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
  addIconContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default TrelloBoardComponent;
