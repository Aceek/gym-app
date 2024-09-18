import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const DayCard = props => {
  const {id, title, content, columnId, onRemove} = props;
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('DayDetails', {weekId: columnId, dayId: id});
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={handlePress} style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardContent}>{content}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SCREEN_WIDTH * 0.03,
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
  removeButton: {
    backgroundColor: 'red',
    borderRadius: SCREEN_WIDTH * 0.02,
    padding: SCREEN_WIDTH * 0.02,
    marginLeft: SCREEN_WIDTH * 0.02,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.04,
  },
});

export default DayCard;
