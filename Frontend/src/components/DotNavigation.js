import React from 'react';
import {View, StyleSheet} from 'react-native';

const DotNavigation = ({currentIndex, total}) => {
  const dots = [];
  for (let i = 0; i < total; i++) {
    const dotStyle = i === currentIndex ? styles.activeDot : styles.inactiveDot;
    dots.push(<View key={i} style={[styles.dot, dotStyle]} />);
  }

  return <View style={styles.container}>{dots}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#2196F3',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
});

export default DotNavigation;
