import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import Button from '../../components/UI/Button';
import PopupRedirect from '../../components/UI/PopupRedirect';
import LinkButton from '../../components/UI/LinkButton';
import {useLoginForm} from '../../hooks/authHooks/useLoginForm';
import ErrorMessage from '../../components/UI/ErrorMessage';
import Title from '../../components/UI/Title';
import EmailInputBlur from '../../components/Inputs/EmailInputBlur';
import PasswordInputBlur from '../../components/Inputs/PasswordInputBlur';

const LoginScreen = ({navigation}) => {
  console.log('LoginScreen rendered');
  const {
    isLoading,
    isGoogleLogin,
    serverError,
    showPopup,
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

      <EmailInputBlur />

      <PasswordInputBlur />

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
