import React, {useEffect, useContext} from 'react';
import {AuthProvider, AuthContext} from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import {configureGoogleSignIn} from './src/config/configureGoogleSignIn';
import {navigationRef} from './src/navigation/RootNavigation';
import {NavigationContainer} from '@react-navigation/native';
import {initializeAxiosInterceptors} from './src/services/api';
import {Provider} from 'react-redux';
import store from './src/store/store';

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
    <Provider store={store}>
      <AuthProvider>
        <React.StrictMode>
          <AppContent />
        </React.StrictMode>
      </AuthProvider>
    </Provider>
  );
};

export default App;
