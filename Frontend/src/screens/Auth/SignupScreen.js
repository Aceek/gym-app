import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import {AuthContext} from '../../context/AuthContext';
import {validateSignUpData} from '../../utils/authValidators';
import {
  validateDisplayName,
  validateEmail,
  validatePasswordRegister,
} from '../../utils/fieldsValidators';

const SignUpScreen = ({navigation}) => {
  const {register} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleDisplayNameBlur = () => {
    const displayNameValidation = validateDisplayName(displayName);
    setErrors(prevErrors => ({
      ...prevErrors,
      displayName: displayNameValidation.valid
        ? null
        : displayNameValidation.errors.join(', '),
    }));
  };

  const handleEmailBlur = () => {
    const emailValidation = validateEmail(email);
    setErrors(prevErrors => ({
      ...prevErrors,
      email: emailValidation.valid ? null : emailValidation.message,
    }));
  };

  const handleConfirmEmailBlur = () => {
    setErrors(prevErrors => ({
      ...prevErrors,
      confirmEmail:
        confirmEmail === email ? null : 'Email and confirmation do not match.',
    }));
  };

  const handlePasswordBlur = () => {
    const passwordValidation = validatePasswordRegister(password);
    setErrors(prevErrors => ({
      ...prevErrors,
      password: passwordValidation.valid
        ? null
        : passwordValidation.errors.join(', '),
    }));
  };

  const handleConfirmPasswordBlur = () => {
    setErrors(prevErrors => ({
      ...prevErrors,
      confirmPassword:
        confirmPassword === password
          ? null
          : 'Password and confirmation do not match.',
    }));
  };

  const handleSignUp = async () => {
    setServerError('');
    setIsLoading(true);
    const {
      valid,
      errors: validationErrors,
      normalizedEmail,
    } = validateSignUpData({
      email,
      password,
      confirmPassword,
      displayName,
      confirmEmail,
    });

    if (!valid) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      await register(normalizedEmail, password, displayName);
      navigation.navigate('Confirmation', {email: normalizedEmail});
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}
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
      {/* add redirect to login button */}
      <Button
        title="Already have an account? Login"
        onPress={() => navigation.navigate('Login')}
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default SignUpScreen;
