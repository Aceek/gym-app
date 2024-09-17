import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const Card = ({id, columnId, title, content, onPress}) => {
  return (
    <TouchableOpacity onPress={() => onPress(id, columnId)}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardContent}>{content}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardContent: {
    fontSize: 14,
    color: '#666',
  },
});

export default Card;
