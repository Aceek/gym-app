import {
  validateEmail,
  validatePasswordRegister,
  validateDisplayName,
  validatePasswordLogin,
  validateToken,
  validateRefreshToken,
  validateResetToken,
  validateCode,
} from "./validators.js";

export const validateRegister = [
  validateEmail(),
  validatePasswordRegister(),
  validateDisplayName(),
];

export const validateLogin = [validateEmail(), validatePasswordLogin()];

export const validateChangePassword = [
  // validateRefreshToken(),
  validateToken("refreshToken", "body"),
  validatePasswordRegister("newPassword"),
];

export const validateConfirmEmail = [validateCode(), validateEmail()];

export const validateForgotPassword = [validateEmail()];

export const validateResendConfirmationEmail = [validateEmail()];

export const validateGoogleAuth = [validateToken("token", "body")];

export const validateLogout = [validateRefreshToken()];

export const validateResetPassword = [
  validateEmail(),
  validateCode(),
  validatePasswordRegister("newPassword"),
];
