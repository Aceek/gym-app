// ExerciseCard.js

import React, {useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ThreeDotsModal from '../Modals/ThreeDotsModal';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const ExerciseCard = ({
  id,
  title,
  initialContent,
  dayId,
  weekId,
  mesocycleId,
  onRemove,
  onModify,
}) => {
  const navigation = useNavigation();

  const handlePress = useCallback(() => {
    navigation.navigate('ExerciseDetails', {
      mesocycleId,
      weekId,
      dayId,
      exerciseId: id,
    });
  }, [navigation, mesocycleId, weekId, dayId, id]);

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.card} onPress={handlePress}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardContent}>{initialContent || 'No content'}</Text>
      </TouchableOpacity>
      <ThreeDotsModal
        onRemove={() => onRemove(id)}
        onModify={() => onModify(id)}
        deleteText="Delete Exercise"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SCREEN_WIDTH * 0.03,
    position: 'relative',
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: SCREEN_WIDTH * 0.02,
    padding: SCREEN_WIDTH * 0.04,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: SCREEN_WIDTH * 0.01,
    elevation: 2,
  },
  cardTitle: {
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: 'bold',
    marginBottom: SCREEN_WIDTH * 0.02,
  },
  cardContent: {
    fontSize: SCREEN_WIDTH * 0.04,
    color: '#666',
  },
});

export default ExerciseCard;
