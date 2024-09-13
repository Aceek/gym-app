import {useCallback, useState} from 'react';
import {validateSignUpData} from '../../validators/registerValidators';
import {
  validateDisplayName,
  validateEmail,
  validatePasswordRegister,
} from '../../validators/fieldsValidators';
import {useContext} from 'react';
import {AuthContext} from '../../context/AuthContext';

export const useSignUpForm = navigation => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const {register} = useContext(AuthContext);

  const handleDisplayNameBlur = useCallback(() => {
    const displayNameValidation = validateDisplayName(displayName);
    setErrors(prevErrors => ({
      ...prevErrors,
      displayName: displayNameValidation.valid
        ? null
        : displayNameValidation.errors.join(', '),
    }));
  }, [displayName]);

  const handleEmailBlur = useCallback(() => {
    const emailValidation = validateEmail(email);
    setErrors(prevErrors => ({
      ...prevErrors,
      email: emailValidation.valid ? null : emailValidation.message,
    }));
  }, [email, setErrors]);

  const handleConfirmEmailBlur = useCallback(() => {
    setErrors(prevErrors => ({
      ...prevErrors,
      confirmEmail:
        confirmEmail.trim().toLowerCase() === email.trim().toLowerCase()
          ? null
          : 'Email and confirmation do not match.',
    }));
  }, [confirmEmail, email, setErrors]);

  const handlePasswordBlur = useCallback(() => {
    const passwordValidation = validatePasswordRegister(password);
    setErrors(prevErrors => ({
      ...prevErrors,
      password: passwordValidation.valid
        ? null
        : passwordValidation.errors.join(', '),
    }));
  }, [password, setErrors]);

  const handleConfirmPasswordBlur = useCallback(() => {
    setErrors(prevErrors => ({
      ...prevErrors,
      confirmPassword:
        confirmPassword === password
          ? null
          : 'Password and confirmation do not match.',
    }));
  }, [confirmPassword, password, setErrors]);

  const handleSignUp = useCallback(async () => {
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
      if (error.details && error.details.redirect) {
        setErrors({});
        setShowPopup(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    confirmEmail,
    confirmPassword,
    displayName,
    email,
    navigation,
    password,
    register,
  ]);

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
    displayName,
    setDisplayName,
    confirmEmail,
    setConfirmEmail,
    confirmPassword,
    setConfirmPassword,
    errors,
    isLoading,
    serverError,
    showPopup,
    handleDisplayNameBlur,
    handleEmailBlur,
    handleConfirmEmailBlur,
    handlePasswordBlur,
    handleConfirmPasswordBlur,
    handleSignUp,
    handleCancel,
    handlePopupTimeout,
  };
};
