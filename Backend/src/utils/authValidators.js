import { body } from "express-validator";

import {
  validateEmail,
  validatePasswordRegister,
  validateDisplayName,
  validatePasswordLogin,
  validateToken,
} from "./validators.js";

export const validateRegister = [
  validateEmail(),
  validatePasswordRegister(),
  validateDisplayName(),
];

export const validateLogin = [validateEmail(), validatePasswordLogin()];

export const validateResetPassword = [
  validateToken(),
  validatePasswordRegister(),
];

export const validateConfirmEmail = [validateToken()];

export const validateForgotPassword = [validateEmail()];

export const validateResendConfirmationEmail = [validateEmail()];

export const validateGoogleAuth = [validateToken()];
