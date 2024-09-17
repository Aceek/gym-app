import React, {useState} from 'react';
import {FlatList, StyleSheet, View, Dimensions} from 'react-native';
import Column from './Column';
import ExerciseDetailsModal from './ExerciseDetailsModal';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const TrelloBoardComponent = ({
  data,
  CardComponent,
  onViewableItemsChanged,
  viewabilityConfig,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const handlePress = exercise => {
    setSelectedExercise(exercise);
    setModalVisible(true);
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
        />
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
