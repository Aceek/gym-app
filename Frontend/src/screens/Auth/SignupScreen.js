import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import InputField from '../../components/Inputs/InputField';
import Button from '../../components/UI/Button';
import {useSignUpForm} from '../../hooks/authHooks/useSignUpForm';
import PopupRedirect from '../../components/UI/PopupRedirect';
import ErrorMessage from '../../components/UI/ErrorMessage';
import Title from '../../components/UI/Title';

const SignUpScreen = ({navigation}) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    displayName,
    setDisplayName,
    confirmEmail,
    setConfirmEmail,
    confirmPassword,
    setConfirmPassword,
    errors,
    isLoading,
    serverError,
    showPopup,
    handleDisplayNameBlur,
    handleEmailBlur,
    handleConfirmEmailBlur,
    handlePasswordBlur,
    handleConfirmPasswordBlur,
    handleSignUp,
    handleCancel,
    handlePopupTimeout,
  } = useSignUpForm(navigation);

  const navigateToLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Title title="Sign Up" />

      <ErrorMessage message={serverError} />
      <InputField
        label="Display Name"
        placeholder="Enter your display name"
        value={displayName}
        onChangeText={setDisplayName}
        onBlur={handleDisplayNameBlur}
        error={errors.displayName}
      />
      <InputField
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        onBlur={handleEmailBlur}
        error={errors.email}
      />
      <InputField
        label="Confirm Email"
        placeholder="Confirm your email"
        value={confirmEmail}
        onChangeText={setConfirmEmail}
        onBlur={handleConfirmEmailBlur}
        error={errors.confirmEmail}
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
      <InputField
        label="Confirm Password"
        placeholder="Confirm your password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        onBlur={handleConfirmPasswordBlur}
        error={errors.confirmPassword}
      />
      <Button
        title="Sign Up"
        onPress={handleSignUp}
        isLoading={isLoading}
        disabled={isLoading}
      />
      <Button
        title="Already have an account? Login"
        onPress={navigateToLogin}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
});

export default SignUpScreen;
