import React from 'react';
import {View, Text, TextInput, Button} from 'react-native';

const SignupScreen = () => {
  return (
    <View>
      <Text>Signup Screen</Text>
      <TextInput placeholder="Email" />
      <TextInput placeholder="Password" secureTextEntry />
      <Button
        title="Sign Up"
        onPress={() => {
          /* Handle sign up logic */
          console.log('Sign up');
        }}
      />
    </View>
  );
};

export default SignupScreen;
