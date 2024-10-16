import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import InputField from '../../components/Inputs/InputField';
import Button from '../../components/UI/Button';
import ConfirmationCodeInput from '../../components/Inputs/ConfirmationCodeInput';
import ErrorMessage from '../../components/UI/ErrorMessage';
import {resetPasswordRequest} from '../../services/authService';
import {validateResetPasswordData} from '../../validators/resetPasswordValidators';
import Title from '../../components/UI/Title';

const ResetPasswordScreen = ({route, navigation}) => {
  const {email} = route.params;
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleResetPassword = useCallback(async () => {
    setServerError('');
    setIsLoading(true);
    setErrors({});
    setMessage('');

    const {valid, errors: validationErrors} = validateResetPasswordData({
      password,
      confirmPassword,
      code,
    });

    if (!valid) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await resetPasswordRequest(email, code, password);

      if (response.status === 200) {
        setMessage('Password reset successfully. Redirecting to login...');
        setTimeout(() => {
          navigation.replace('Login');
        }, 2000);
      } else {
        setServerError('Failed to reset password. Please try again.');
      }
    } catch (err) {
      setServerError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email, code, password, confirmPassword, navigation]);

  const navigateToLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Title title="Reset Your Password" />
      <Text style={styles.message}>
        Enter the 6-digit code sent to {email} and set a new password.
      </Text>
      <ConfirmationCodeInput code={code} setCode={setCode} />
      <ErrorMessage message={errors.code} />
      <InputField
        label="New Password"
        placeholder="Enter your new password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        error={errors.password}
      />
      <InputField
        label="Confirm Password"
        placeholder="Confirm your new password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={errors.confirmPassword}
      />
      {message ? <Text style={styles.successText}>{message}</Text> : null}
      <ErrorMessage message={serverError} />
      <Button
        title="Reset Password"
        onPress={handleResetPassword}
        isLoading={isLoading}
        disabled={isLoading}
      />
      <Button
        title="Back to Login"
        onPress={navigateToLogin}
        disabled={isLoading}
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
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ResetPasswordScreen;
