import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';

const CustomCheckbox = ({label, value, onValueChange}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onValueChange(!value)}>
      <View style={[styles.checkbox, value && styles.checked]}>
        {value && <View style={styles.innerCheck} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 3,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  innerCheck: {
    width: 12,
    height: 12,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
  },
});

export default CustomCheckbox;
