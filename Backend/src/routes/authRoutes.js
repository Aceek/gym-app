import { Router } from "express";
import {
  authenticateGoogleUser,
  googleLogout,
} from "../controllers/auth/googleAuthController.js";
import googleAuthMiddleware from "../middlewares/googleAuthMiddleware.js";
import {
  register,
  login,
  confirmEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth/emailAuthController.js";
import {
  validateRegister,
  validateLogin,
  validateResetPassword,
} from "../utils/validators.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";

const router = Router();

router.post("/google", googleAuthMiddleware, authenticateGoogleUser);
router.get("/googleLogout", googleLogout);

router.post("/register", validateRegister, validationMiddleware, register);
router.post("/login", validateLogin, validationMiddleware, login);
router.get("/confirm-email", confirmEmail);
router.post("/forgot-password", forgotPassword);
router.post(
  "/reset-password",
  validateResetPassword,
  validationMiddleware,
  resetPassword
);

export default router;
