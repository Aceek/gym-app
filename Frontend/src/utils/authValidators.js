import {
  validateEmail,
  validatePasswordRegister,
  validateDisplayName,
} from './fieldsValidators';

export const validateSignUpData = ({
  email,
  password,
  confirmPassword,
  displayName,
  confirmEmail,
}) => {
  const errors = {};

  const displayNameValidation = validateDisplayName(displayName);
  if (!displayNameValidation.valid) {
    errors.displayName = displayNameValidation.errors.join(', ');
  }

  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.message;
  }

  const passwordValidation = validatePasswordRegister(password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.errors.join(', ');
  }

  if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
    errors.confirmEmail = 'Email and confirmation do not match.';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Password and confirmation do not match.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    normalizedEmail: emailValidation.valid
      ? emailValidation.normalizedEmail
      : email,
  };
};

export const validateUserForLogin = async (email, password) => {
  const errors = {};

  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    errors.email = emailValidation.message;
  }

  const passwordValidation = validatePasswordRegister(password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.errors.join(', ');
  }

  const userInfo = {
    email: emailValidation.normalizedEmail,
    password,
  };
  return {
    valid: Object.keys(errors).length === 0,
    errors,
    userInfo,
  };
};
