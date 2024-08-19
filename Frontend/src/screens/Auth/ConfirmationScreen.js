import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Button from '../../components/Button';
import {resendConfirmationEmail} from '../../services/authService';
import useCountdown from '../../hooks/useCountdown';

const ConfirmationScreen = ({route, navigation}) => {
  const {email} = route.params;
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const {timer, startCountdown, resetCountdown, isActive} = useCountdown(
    45,
    () => setIsSending(false),
  );

  useEffect(() => {
    startCountdown();
  }, [startCountdown]);

  const handleResendEmail = async () => {
    setIsSending(true);
    setError('');
    setMessage('');

    try {
      const response = await resendConfirmationEmail(email);

      if (response.status === 200) {
        setMessage("L'email de confirmation a été renvoyé avec succès.");
        startCountdown();
      } else {
        setError(
          response.data.error || 'Une erreur est survenue. Veuillez réessayer.',
        );
        resetCountdown();
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
      resetCountdown();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vérification de l'Email Requise</Text>
      <Text style={styles.message}>
        Un email de confirmation a été envoyé à {email}. Veuillez vérifier votre
        boîte de réception et cliquer sur le lien pour activer votre compte.
      </Text>
      {message ? <Text style={styles.successText}>{message}</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button
        onPress={handleResendEmail}
        title={
          isActive
            ? `Renvoyer l'email dans ${timer}s`
            : "Renvoyer l'email de confirmation"
        }
        disabled={isSending || isActive}
        isLoading={isSending}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ConfirmationScreen;
