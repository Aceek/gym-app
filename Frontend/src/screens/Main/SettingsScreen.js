import React from 'react';
import {View, Text, Button} from 'react-native';

const SettingsScreen = () => {
  return (
    <View>
      <Text>Settings Screen</Text>
      {/* Provide settings options */}
      <Button
        title="Change Settings"
        onPress={() => {
          /* Handle settings change */
        }}
      />
    </View>
  );
};

export default SettingsScreen;
