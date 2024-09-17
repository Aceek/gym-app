import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Card from './Card';

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
    flex: 1, // Allow the container to take up the full width of the screen
    alignItems: 'center', // Center columns horizontally
    justifyContent: 'flex-start', // Keep the columns aligned to the top vertically
    paddingTop: 10, // Add some padding to the top if necessary
  },
  column: {
    width: 300, // Set the width for the column
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    maxHeight: '100%',
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center', // Center the title text
  },
});

export default Column;
