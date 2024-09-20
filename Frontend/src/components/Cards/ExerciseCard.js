import React, {useState, useEffect, useCallback, useMemo} from 'react';
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

const ExerciseCard = React.memo(props => {
  const {id, title, initialContent, onRemove, onModify} = props;
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const contentParts = initialContent.split(', ');
    const newWeight =
      contentParts
        .find(part => part.startsWith('Weight:'))
        ?.split(': ')[1]
        .replace('kg', '') || '';
    const newReps =
      contentParts.find(part => part.startsWith('Reps:'))?.split(': ')[1] || '';
    const newRpe =
      contentParts.find(part => part.startsWith('RPE:'))?.split(': ')[1] || '';

    setWeight(newWeight);
    setReps(newReps);
    setRpe(newRpe);
  }, [initialContent]);

  const handlePress = useCallback(() => {
    navigation.navigate('ExerciseDetails', {
      exercise: {id, title, content: initialContent, weight, reps, rpe},
    });
  }, [navigation, id, title, initialContent, weight, reps, rpe]);

  const handleRemove = useCallback(() => onRemove(id), [onRemove, id]);
  const handleModify = useCallback(() => onModify(id), [onModify, id]);

  const memoizedThreeDotsModal = useMemo(
    () => (
      <ThreeDotsModal
        onRemove={handleRemove}
        onModify={handleModify}
        deleteText="Delete Card"
      />
    ),
    [handleRemove, handleModify],
  );

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.card} onPress={handlePress}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardContent}>{initialContent}</Text>
      </TouchableOpacity>
      {memoizedThreeDotsModal}
    </View>
  );
});

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
