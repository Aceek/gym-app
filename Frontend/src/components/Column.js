import React from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import HeaderInfoCard from './HeaderInfoCard';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const Column = ({title, data, renderCard, children, headerInfo}) => {
  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Text style={styles.columnTitle}>{title}</Text>
        {headerInfo && <HeaderInfoCard headerInfo={headerInfo} />}
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {data.map((item, index) => (
            <View key={item.id || index} style={styles.cardContainer}>
              {renderCard(item)}
            </View>
          ))}
        </ScrollView>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: SCREEN_WIDTH * 0.02,
  },
  column: {
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: '#f0f0f0',
    borderRadius: SCREEN_WIDTH * 0.03,
    padding: SCREEN_WIDTH * 0.03,
    maxHeight: '95%',
  },
  columnTitle: {
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: 'bold',
    marginBottom: SCREEN_WIDTH * 0.02,
    textAlign: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  cardContainer: {
    marginBottom: SCREEN_WIDTH * 0.02,
  },
});

export default Column;
