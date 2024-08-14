import { body } from "express-validator";

import {
  validateEmail,
  validatePasswordRegister,
  validateDisplayName,
  validatePasswordLogin,
  validateToken,
  validateRefreshToken,
  validateResetToken,
} from "./validators.js";

export const validateRegister = [
  validateEmail(),
  validatePasswordRegister(),
  validateDisplayName(),
];

export const validateLogin = [validateEmail(), validatePasswordLogin()];

export const validateChangePassword = [
  validateToken(),
  validateRefreshToken(),
  validatePasswordRegister("newPassword"),
];

export const validateConfirmEmail = [validateToken()];

export const validateForgotPassword = [validateEmail()];

export const validateResendConfirmationEmail = [validateEmail()];

export const validateGoogleAuth = [validateToken()];

export const validateLogout = [validateRefreshToken(), validateToken()];

export const validateResetPassword = [
  validateResetToken(),
  validatePasswordRegister("newPassword"),
];
