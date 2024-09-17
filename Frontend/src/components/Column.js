import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Card from './Card';

const Column = ({id, title, cardIds, cards, onCardPress}) => {
  return (
    <View style={styles.column}>
      <Text style={styles.columnTitle}>{title}</Text>
      <ScrollView>
        {cardIds.map(cardId => {
          const card = cards.find(c => c.id === cardId);
          return card ? (
            <Card
              key={cardId}
              {...card}
              onPress={() => onCardPress(cardId, id)}
            />
          ) : null;
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    width: 300,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    maxHeight: '100%',
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Column;
