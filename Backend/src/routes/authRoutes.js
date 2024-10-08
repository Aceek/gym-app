import * as authControllers from "../controllers/auth/emailAuthController.js";
import * as googleAuthControllers from "../controllers/auth/googleAuthController.js";
import * as authValidators from "../utils/validators/authValidators.js";
import validationMiddleware from "../middlewares/validation/validationMiddleware.js";
import googleAuthMiddleware from "../middlewares/auth/googleAuthMiddleware.js";
import { Router } from "express";
import jwtMiddleware from "../middlewares/auth/jwtMiddleware.js";

const router = Router();

router.post(
  "/google",
  authValidators.validateGoogleAuth,
  validationMiddleware,
  googleAuthMiddleware,
  googleAuthControllers.authenticateGoogleUser
);

router.post(
  "/register",
  authValidators.validateRegister,
  validationMiddleware,
  authControllers.register
);
router.post(
  "/login",
  authValidators.validateLogin,
  validationMiddleware,
  authControllers.login
);
router.post(
  "/confirm-email",
  authValidators.validateConfirmEmail,
  validationMiddleware,
  authControllers.confirmEmail
);
router.post(
  "/forgot-password",
  authValidators.validateForgotPassword,
  validationMiddleware,
  authControllers.forgotPassword
);
router.post(
  "/change-password",
  authValidators.validateChangePassword,
  validationMiddleware,
  jwtMiddleware,
  authControllers.changePassword
);

router.post(
  "/reset-password",
  authValidators.validateResetPassword,
  validationMiddleware,
  authControllers.resetPassword
);

router.post(
  "/resend-confirmation-email",
  authValidators.validateResendConfirmationEmail,
  validationMiddleware,
  authControllers.resendConfirmationEmail
);

router.post(
  "/logout",
  authValidators.validateLogout,
  validationMiddleware,
  jwtMiddleware,
  authControllers.logout
);

export default router;
