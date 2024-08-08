import React from 'react';
import {View, Text, TextInput, Button} from 'react-native';

const ForgotPasswordScreen = () => {
  return (
    <View>
      <Text>Forgot Password Screen</Text>
      <TextInput placeholder="Email" />
      <Button
        title="Reset Password"
        onPress={() => {
          /* Handle password reset logic */
          console.log('Reset password');
        }}
      />
    </View>
  );
};

export default ForgotPasswordScreen;
