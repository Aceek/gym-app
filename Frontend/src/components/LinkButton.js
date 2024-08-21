// src/components/LinkButton.js
import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const LinkButton = ({title, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.linkText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linkText: {
    color: '#6200ee',
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 20,
  },
});

export default LinkButton;
