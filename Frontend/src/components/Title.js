import React from 'react';
import {Text, StyleSheet} from 'react-native';

const Title = React.memo(({title}) => {
  return <Text style={styles.title}>{title}</Text>;
});

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
});

export default Title;
