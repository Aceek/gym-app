import {
  validatePasswordRegister,
  validateConfirmationCode,
} from './fieldsValidators';

export const validateResetPasswordData = ({
  password,
  confirmPassword,
  code,
}) => {
  const errors = {};

  const passwordValidation = validatePasswordRegister(password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.errors.join(', ');
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Password and confirmation do not match.';
  }

  if (!validateConfirmationCode(code)) {
    errors.code = 'Please enter a 6-digit verification code.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
