import React, {useContext} from 'react';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import {AuthContext} from '../context/AuthContext';
import {View, ActivityIndicator} from 'react-native';
import {StyleSheet} from 'react-native';

const AppNavigator = () => {
  const {user, isLoading} = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return user ? <AppStack /> : <AuthStack />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;
