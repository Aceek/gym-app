import React, {useEffect} from 'react';
import {AuthProvider} from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import {configureGoogleSignIn} from './src/config/configureGoogleSignIn';
import {navigationRef} from './src/navigation/RootNavigation';
import {NavigationContainer} from '@react-navigation/native';
import {useContext} from 'react';
import {AuthContext} from './src/context/AuthContext';
import {initializeAxiosInterceptors} from './src/services/api';

const AppContent = () => {
  const {logout} = useContext(AuthContext);

  useEffect(() => {
    configureGoogleSignIn();
    initializeAxiosInterceptors(logout);
  }, [logout]);

  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigator />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
