import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {AuthContext} from '../../context/AuthContext';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import PopupRedirect from '../../components/PopupRedirect';
import LinkButton from '../../components/LinkButton';
import {useLoginForm} from '../../hooks/authHooks/useLoginForm';
import ErrorMessage from '../../components/ErrorMessage';

const LoginScreen = ({navigation}) => {
  const {login} = useContext(AuthContext);
  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isLoading,
    isGoogleLogin,
    serverError,
    showPopup,
    handleEmailBlur,
    handlePasswordBlur,
    handleLogin,
    handleLoginWithGoogle,
    handleCancel,
    handlePopupTimeout,
  } = useLoginForm();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <ErrorMessage message={serverError} />
      <InputField
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        onBlur={handleEmailBlur}
        error={errors.email}
      />
      <InputField
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onBlur={handlePasswordBlur}
        error={errors.password}
      />
      <LinkButton
        title="Forgot Password?"
        onPress={() => navigation.navigate('ForgotPassword')}
      />
      <Button
        title="Login"
        onPress={() => handleLogin(login, navigation)}
        isLoading={isLoading}
        disabled={isLoading || isGoogleLogin}
      />
      <Button
        title="Don't have an account? Sign Up"
        onPress={() => navigation.navigate('Signup')}
        disabled={isLoading || isGoogleLogin}
      />
      <Button
        title="Login with Google"
        onPress={() => handleLoginWithGoogle(login, navigation)}
        disabled={isLoading || isGoogleLogin}
        isLoading={isGoogleLogin}
        type="google"
      />
      <PopupRedirect
        visible={showPopup}
        message="Email not verified. Redirecting to confirmation page..."
        onCancel={handleCancel}
        onTimeout={() => handlePopupTimeout(navigation)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
});

export default LoginScreen;
