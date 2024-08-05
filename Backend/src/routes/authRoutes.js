import express from "express";
import {
  loginGoogle,
  googleAuth,
  googleCallback,
  logout,
  authFailure,
  protectedRoute,
  profile,
} from "../controllers/authController.js";
import isLoggedIn from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/auth/google", googleAuth);
router.get("/google/callback", googleCallback);
router.get("/logout", logout);
router.get("/auth/failure", authFailure);
router.get("/protected", isLoggedIn, protectedRoute);
router.get("/profile", isLoggedIn, profile);

export default router;
