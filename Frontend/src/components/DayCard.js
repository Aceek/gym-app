import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const DayCard = ({day, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{day.title}</Text>
        <Text style={styles.cardContent}>{day.content}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: SCREEN_WIDTH * 0.02,
    padding: SCREEN_WIDTH * 0.04,
    marginBottom: SCREEN_WIDTH * 0.03,
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

export default DayCard;
