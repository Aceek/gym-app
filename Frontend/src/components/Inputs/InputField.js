import React from 'react';
import {TextInput, View, Text, StyleSheet} from 'react-native';

const InputField = React.memo(
  ({
    label,
    placeholder,
    secureTextEntry,
    value,
    onChangeText,
    onBlur,
    error,
  }) => {
    console.log('InputField rendered = ', label);
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default InputField;
