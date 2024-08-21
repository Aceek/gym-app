import {validateEmail, validatePasswordRegister} from './fieldsValidators';

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
