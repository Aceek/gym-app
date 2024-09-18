import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import ThreeDotsModal from '../Modals/ThreeDotsModal';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const SetCard = ({id, reps, weight, rpe, type, onRemove, onPress}) => {
  const getCardStyle = () => {
    switch (type) {
      case 'superset':
        return [styles.card, styles.supersetCard];
      case 'dropset':
        return [styles.card, styles.dropsetCard];
      default:
        return styles.card;
    }
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={getCardStyle()} onPress={onPress}>
        <Text style={styles.cardTitle}>Set Details</Text>
        <Text style={styles.cardContent}>
          Reps: {reps} | Weight: {weight} kg
          {rpe !== undefined && rpe !== null ? ` | RPE: ${rpe}` : ''}
        </Text>
      </TouchableOpacity>
      <ThreeDotsModal onRemove={() => onRemove(id)} deleteText="Delete Set" />
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
    backgroundColor: 'white', // Default background color
    borderRadius: SCREEN_WIDTH * 0.02,
    padding: SCREEN_WIDTH * 0.04,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: SCREEN_WIDTH * 0.01,
    elevation: 2,
  },
  supersetCard: {
    backgroundColor: '#FFEB3B', // Yellow
  },
  dropsetCard: {
    backgroundColor: '#FFCDD2', // Light Red
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

export default SetCard;
