import {useState, useCallback, useContext} from 'react';
import {
  validateEmail,
  validatePasswordRegister,
} from '../../validators/fieldsValidators';
import {validateUserForLogin} from '../../validators/loginValidators';
import {AuthContext} from '../../context/AuthContext';

export const useLoginForm = navigation => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLogin, setIsGoogleLogin] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const {login} = useContext(AuthContext);

  const handleEmailBlur = useCallback(() => {
    const emailValidation = validateEmail(email);
    setErrors(prevErrors => ({
      ...prevErrors,
      email: emailValidation.valid ? null : emailValidation.message,
    }));
  }, [email]);

  const handlePasswordBlur = useCallback(() => {
    const passwordValidation = validatePasswordRegister(password);
    setErrors(prevErrors => ({
      ...prevErrors,
      password: passwordValidation.valid
        ? null
        : passwordValidation.errors.join(', '),
    }));
  }, [password]);

  const handleLogin = useCallback(async () => {
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
  }, [email, password, login]);

  const handleLoginWithGoogle = useCallback(async () => {
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
  }, [login]);

  const handleCancel = useCallback(() => {
    setShowPopup(false);
  }, []);

  const handlePopupTimeout = useCallback(() => {
    setShowPopup(false);
    navigation.navigate('Confirmation', {email: email.toLowerCase().trim()});
  }, [email, navigation]);

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
