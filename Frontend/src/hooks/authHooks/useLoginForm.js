import {useState} from 'react';
import {
  validateEmail,
  validatePasswordRegister,
} from '../../validators/fieldsValidators';
import {validateUserForLogin} from '../../validators/loginValidators';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLogin, setIsGoogleLogin] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleEmailBlur = () => {
    const emailValidation = validateEmail(email);
    setErrors(prevErrors => ({
      ...prevErrors,
      email: emailValidation.valid ? null : emailValidation.message,
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

  const handleLogin = async (login, navigation) => {
    setServerError('');
    setErrors({});
    setIsLoading(true);

    try {
      const {
        valid,
        errors: validationErrors,
        userInfo,
      } = await validateUserForLogin(email, password);

      if (!valid) {
        setErrors(validationErrors);
        setIsLoading(false);
        return;
      }

      await login(false, userInfo);
    } catch (err) {
      setServerError(err.message);
      if (err.details && err.details.redirect) {
        setErrors({});
        setShowPopup(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithGoogle = async (login, navigation) => {
    setServerError('');
    setErrors({});
    setIsGoogleLogin(true);

    try {
      await login(true);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsGoogleLogin(false);
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  const handlePopupTimeout = navigation => {
    setShowPopup(false);
    navigation.navigate('Confirmation', {email: email.toLowerCase().trim()});
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isLoading,
    isGoogleLogin,
    serverError,
    showPopup,
    handleEmailBlur,
    handlePasswordBlur,
    handleLogin,
    handleLoginWithGoogle,
    handleCancel,
    handlePopupTimeout,
  };
};
