import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const HeaderInfoCard = ({headerInfo, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.container}>
        {Object.entries(headerInfo).map(([key, value]) => (
          <Text key={key} style={styles.text}>
            {key}: {value}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
});

export default HeaderInfoCard;
