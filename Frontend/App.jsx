import React, {useEffect} from 'react';
import {AuthProvider} from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import {configureGoogleSignIn} from './src/config/configureGoogleSignIn';
import {navigationRef} from './src/navigation/RootNavigation';
import {NavigationContainer} from '@react-navigation/native';
import {
  setupAxiosInterceptors401,
  setupAxiosInterceptorsJwt,
} from './src/services/api';
import {useContext} from 'react';
import {AuthContext} from './src/context/AuthContext';

const AppContent = () => {
  const {logout} = useContext(AuthContext);

  useEffect(() => {
    configureGoogleSignIn();
    setupAxiosInterceptors401(logout);
    setupAxiosInterceptorsJwt();
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
