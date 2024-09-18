import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import ThreeDotsModal from './ThreeDotsModal';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const ExerciseCard = props => {
  const {id, title, initialContent, columnId, handlePress, onRemove} = props;
  const [content, setContent] = useState(initialContent);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('');

  useEffect(() => {
    // Parse initial content to set weight, reps, and rpe
    const contentParts = initialContent.split(', ');
    contentParts.forEach(part => {
      const [key, value] = part.split(': ');
      if (key === 'Weight') setWeight(value.replace('kg', ''));
      if (key === 'Reps') setReps(value);
      if (key === 'RPE') setRpe(value);
    });
  }, [initialContent]);

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => handlePress({id, title, content, weight, reps, rpe})}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardContent}>{content}</Text>
      </TouchableOpacity>
      <ThreeDotsModal onRemove={onRemove} deleteText="Delete Card" />
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
