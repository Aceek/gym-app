import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import {forgotPasswordRequest} from '../../services/authService';
import {validateEmail} from '../../validators/fieldsValidators';
import useCountdown from '../../hooks/useCountdown';

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [serverError, setServerError] = useState('');

  const {timer, startCountdown, isActive} = useCountdown(
    60,
    () => setIsLoading(false),
    'forgotPassword',
  );

  const handleForgotPassword = async () => {
    setServerError('');
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const validEmail = validateEmail(email);

      if (!validEmail.valid) {
        setError(validEmail.message);
        setIsLoading(false);
        return;
      }

      await forgotPasswordRequest(email);

      setMessage('Password reset email sent successfully. Check your inbox.');
      startCountdown();
    } catch (err) {
      setServerError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <InputField
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        error={error}
      />
      {message ? <Text style={styles.successText}>{message}</Text> : null}
      <ErrorMessage message={serverError} />
      <Button
        title={isActive ? `Resend email in ${timer}s` : 'Reset Password'}
        onPress={handleForgotPassword}
        isLoading={isLoading}
        disabled={isLoading || isActive}
      />
      <Button
        title="Back to Login"
        onPress={() => navigation.navigate('Login')}
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
  successText: {
    color: 'green',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;
