import {useState, useEffect, useCallback} from 'react';
import {
  resendConfirmationEmail,
  sendConfirmationCode,
} from '../../services/authService';
import {validateConfirmationCode} from '../../validators/fieldsValidators';
import useCountdown from '../useCountdown';

export const useConfirmation = (email, navigation) => {
  const [code, setCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const {timer, startCountdown, resetCountdown, isActive} = useCountdown(
    45,
    () => setIsSending(false),
    'confirmation',
  );

  useEffect(() => {
    startCountdown();
  }, [startCountdown]);

  const handleResendEmail = useCallback(async () => {
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
  }, [email, resetCountdown, startCountdown]);

  const handleVerifyCode = useCallback(async () => {
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
      console.log(response);

      if (response.data.status === 'success') {
        setMessage(
          'Code vérifié avec succès, redirection vers la page de connexion...',
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
  }, [code, email, navigation]);

  return {
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
  };
};
