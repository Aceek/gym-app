import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import PopupRedirect from '../../components/PopupRedirect';
import LinkButton from '../../components/LinkButton';
import {useLoginForm} from '../../hooks/authHooks/useLoginForm';
import ErrorMessage from '../../components/ErrorMessage';
import Title from '../../components/Title';

const LoginScreen = ({navigation}) => {
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
  } = useLoginForm(navigation);

  const navigateToSignup = useCallback(() => {
    navigation.navigate('Signup');
  }, [navigation]);

  const navigateToForgotPassword = useCallback(() => {
    navigation.navigate('ForgotPassword');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Title title="Login" />
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
      <LinkButton title="Forgot Password?" onPress={navigateToForgotPassword} />
      <Button
        title="Login"
        onPress={handleLogin}
        isLoading={isLoading}
        disabled={isLoading || isGoogleLogin}
      />
      <Button
        title="Don't have an account? Sign Up"
        onPress={navigateToSignup}
        disabled={isLoading || isGoogleLogin}
      />
      <Button
        title="Login with Google"
        onPress={handleLoginWithGoogle}
        disabled={isLoading || isGoogleLogin}
        isLoading={isGoogleLogin}
        type="google"
      />
      <PopupRedirect
        visible={showPopup}
        message="Email not verified. Redirecting to confirmation page..."
        onCancel={handleCancel}
        onTimeout={handlePopupTimeout}
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
});

export default LoginScreen;
