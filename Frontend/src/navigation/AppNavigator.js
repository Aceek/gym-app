import React, {useContext} from 'react';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import {AuthContext} from '../context/AuthContext';

const AppNavigator = () => {
  const {user} = useContext(AuthContext);

  return user ? <AppStack /> : <AuthStack />;
};

export default AppNavigator;
