import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const MesoCycleCard = ({mesocycle, navigation}) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('WeekScreen', {mesocycleId: mesocycle.id})
      }>
      <View style={styles.container}>
        <Text>{mesocycle.name}</Text>
        <Text>{mesocycle.duration} weeks</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
});

export default MesoCycleCard;
