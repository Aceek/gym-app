import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import ThreeDotsModal from './ThreeDotsModal';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const SetCard = ({id, reps, weight, onRemove}) => {
  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardTitle}>Set Details</Text>
        <Text style={styles.cardContent}>
          Reps: {reps} | Weight: {weight} kg
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

export default SetCard;
