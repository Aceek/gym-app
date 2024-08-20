import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Button from '../../components/Button';
import {
  resendConfirmationEmail,
  sendConfirmationCode,
} from '../../services/authService';
import {validateConfirmationCode} from '../../utils/fieldsValidators';
import useCountdown from '../../hooks/useCountdown';
import ConfirmationCodeInput from '../../components/ConfirmationCodeInput';

const ConfirmationScreen = ({route, navigation}) => {
  const {email} = route.params;
  const [code, setCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
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

  const handleVerifyCode = async () => {
    setIsVerifying(true);
    setError('');
    setMessage('');

    try {
      const isValid = validateConfirmationCode(code);
      if (!isValid) {
        setError('Le code doit être un nombre de 6 chiffres.');
        setIsVerifying(false);
        return;
      }

      const response = await sendConfirmationCode(email, code);

      if (response.data.status === 'success') {
        setMessage(
          'Code vérifié avec succès redirection vers la page de connection...',
        );
        setTimeout(() => {
          navigation.replace('Login');
        }, 2000);
      } else {
        setError(
          response.data.error.message || 'Code invalide. Veuillez réessayer.',
        );
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vérification de l'Email Requise</Text>
      <Text style={styles.message}>
        Un code de confirmation a été envoyé à {email}. Veuillez entrer le code
        ci-dessous pour activer votre compte.
      </Text>
      <ConfirmationCodeInput code={code} setCode={setCode} />
      {message ? <Text style={styles.successText}>{message}</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button
        onPress={handleVerifyCode}
        title="Vérifier le Code"
        disabled={isVerifying}
        isLoading={isVerifying}
      />
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
