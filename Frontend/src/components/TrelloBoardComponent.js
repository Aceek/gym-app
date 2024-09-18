import React, {useState, useEffect} from 'react';
import {FlatList, StyleSheet, View, Dimensions, Button} from 'react-native';
import Column from './Column';
import ExerciseDetailsModal from './ExerciseDetailsModal';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const TrelloBoardComponent = ({
  data: initialData,
  CardComponent,
  onViewableItemsChanged,
  viewabilityConfig,
  onAddCard,
  onRemoveCard,
}) => {
  const [data, setData] = useState(initialData);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handlePress = exercise => {
    setSelectedExercise(exercise);
    setModalVisible(true);
  };

  const handleAddCard = columnId => {
    const newCard = onAddCard(columnId);
    if (newCard) {
      setData(prevData =>
        prevData.map(column =>
          column.id === columnId
            ? {...column, data: [...column.data, newCard]}
            : column,
        ),
      );
    }
  };

  const handleRemoveCard = (columnId, cardId) => {
    onRemoveCard(columnId, cardId);
    setData(prevData =>
      prevData.map(column =>
        column.id === columnId
          ? {...column, data: column.data.filter(card => card.id !== cardId)}
          : column,
      ),
    );
  };

  const renderItem = ({item}) => (
    <Column
      title={item.title}
      data={item.data}
      renderCard={cardItem => (
        <CardComponent
          {...cardItem}
          columnId={item.id}
          handlePress={handlePress}
          onRemove={() => handleRemoveCard(item.id, cardItem.id)}
        />
      )}>
      <Button title="Add Card" onPress={() => handleAddCard(item.id)} />
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
      <ExerciseDetailsModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        exercise={selectedExercise}
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
