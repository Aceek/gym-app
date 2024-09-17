import React from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import Card from './Card';

const {width: SCREEN_WIDTH} = Dimensions.get('window'); // Get screen width for responsiveness

const Column = ({id, title, cards, onCardPress}) => {
  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Text style={styles.columnTitle}>{title}</Text>
        <ScrollView>
          {cards.map(card => (
            <Card
              key={card.id}
              {...card}
              onPress={() => onCardPress(card.id, id)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: SCREEN_WIDTH * 0.02,
  },
  column: {
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: '#f0f0f0',
    borderRadius: SCREEN_WIDTH * 0.03,
    padding: SCREEN_WIDTH * 0.03,
    marginBottom: SCREEN_WIDTH * 0.03,
    maxHeight: '100%',
  },
  columnTitle: {
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: 'bold',
    marginBottom: SCREEN_WIDTH * 0.02,
    textAlign: 'center',
  },
});

export default Column;
