import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Button from '../../components/Button';
import {useConfirmation} from '../../hooks/authHooks/useConfirmation';
import ConfirmationCodeInput from '../../components/ConfirmationCodeInput';

const ConfirmationScreen = ({route, navigation}) => {
  const {email} = route.params;
  const {
    code,
    setCode,
    isSending,
    isVerifying,
    message,
    error,
    timer,
    isActive,
    handleResendEmail,
    handleVerifyCode,
  } = useConfirmation(email, navigation);

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
