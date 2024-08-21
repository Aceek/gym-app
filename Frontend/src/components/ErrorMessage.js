// src/components/ErrorMessage.js
import React from 'react';
import {Text, StyleSheet} from 'react-native';

const ErrorMessage = ({message}) => {
  return message ? <Text style={styles.errorText}>{message}</Text> : null;
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ErrorMessage;
