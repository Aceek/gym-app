import React, {useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import {forgotPasswordRequest} from '../../services/authService';
import {validateEmail} from '../../validators/fieldsValidators';
import useCountdown from '../../hooks/useCountdown';
import LinkButton from '../../components/LinkButton';
import {useDispatch, useSelector} from 'react-redux';
import {
  setIsLoading,
  setMessage,
  setError,
  setServerError,
} from '../../store/slices/forgotPasswordSlice';
import store from '../../store/store';
import EmailInputField from '../../components/EmailInputField';
import Title from '../../components/Title';

const ForgotPasswordScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.forgotPassword.isLoading);
  const message = useSelector(state => state.forgotPassword.message);

  const {timer, startCountdown, isActive} = useCountdown(
    60,
    () => dispatch(setIsLoading(false)),
    'forgotPassword',
  );

  const handleForgotPassword = useCallback(async () => {
    dispatch(setServerError(''));
    dispatch(setIsLoading(true));
    dispatch(setError(''));
    dispatch(setMessage(''));

    const email = store.getState().forgotPassword.email;

    try {
      const validEmail = validateEmail(email);

      if (!validEmail.valid) {
        dispatch(setError(validEmail.message));
        dispatch(setIsLoading(false));
        return;
      }

      const response = await forgotPasswordRequest(email);
      startCountdown();
      if (response.data.status === 'success') {
        dispatch(
          setMessage('Password reset email sent successfully. Redirecting...'),
        );
        setTimeout(() => {
          navigation.navigate('ResetPassword', {email});
        }, 2000);
      }
    } catch (err) {
      dispatch(
        setServerError(err.message || 'An error occurred. Please try again.'),
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch, navigation, startCountdown]);

  const navigateToLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const handleRedirectToReset = useCallback(() => {
    dispatch(setServerError(''));
    dispatch(setError(''));
    dispatch(setMessage(''));

    const email = store.getState().forgotPassword.email;

    const validEmail = validateEmail(email);

    if (!validEmail.valid) {
      dispatch(setError(validEmail.message));
      return;
    }

    navigation.navigate('ResetPassword', {email});
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <Title title="Forgot Password" />

      <EmailInputField />
      <LinkButton title="Enter Code" onPress={handleRedirectToReset} />
      {message ? <Text style={styles.successText}>{message}</Text> : null}
      <ErrorMessage message={store.getState().forgotPassword.serverError} />
      <Button
        title={isActive ? `Resend email in ${timer}s` : 'Reset Password'}
        onPress={handleForgotPassword}
        isLoading={isLoading}
        disabled={isLoading || isActive}
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
  successText: {
    color: 'green',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;
