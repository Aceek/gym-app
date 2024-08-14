import { body } from "express-validator";

import {
  validateEmail,
  validatePasswordRegister,
  validateDisplayName,
  validatePasswordLogin,
  validateToken,
  validateRefreshToken,
} from "./validators.js";

export const validateRegister = [
  validateEmail(),
  validatePasswordRegister(),
  validateDisplayName(),
];

export const validateLogin = [validateEmail(), validatePasswordLogin()];

export const validateResetPassword = [
  validateToken(),
  validateRefreshToken(),
  validatePasswordRegister(),
];

export const validateConfirmEmail = [validateToken()];

export const validateForgotPassword = [validateEmail()];

export const validateResendConfirmationEmail = [validateEmail()];

export const validateGoogleAuth = [validateToken()];

export const validateLogout = [validateRefreshToken(), validateToken()];
