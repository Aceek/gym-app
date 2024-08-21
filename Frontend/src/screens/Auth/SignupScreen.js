// src/screens/SignUpScreen.js
import React, {useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import {AuthContext} from '../../context/AuthContext';
import {useSignUpForm} from '../../hooks/authHooks/useSignUpForm';
import PopupRedirect from '../../components/PopupRedirect';
import ErrorMessage from '../../components/ErrorMessage';

const SignUpScreen = ({navigation}) => {
  const {register} = useContext(AuthContext);
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
  } = useSignUpForm();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
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
        onPress={() => handleSignUp(register, navigation)}
        isLoading={isLoading}
        disabled={isLoading}
      />
      <Button
        title="Already have an account? Login"
        onPress={() => navigation.navigate('Login')}
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

export default SignUpScreen;
