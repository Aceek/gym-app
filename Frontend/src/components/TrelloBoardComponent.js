import React from 'react';
import {FlatList, StyleSheet, View, Dimensions} from 'react-native';
import Column from './Column';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const TrelloBoardComponent = ({
  data,
  CardComponent,
  onViewableItemsChanged,
  viewabilityConfig,
}) => {
  const renderItem = ({item}) => (
    <Column
      title={item.title}
      data={item.data}
      renderCard={cardItem => (
        <CardComponent {...cardItem} columnId={item.id} />
      )}
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
    justifyContent: 'flex-start',
  },
});

export default TrelloBoardComponent;
