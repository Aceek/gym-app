import { Router } from "express";
import {
  authenticateGoogleUser,
  logout,
} from "../controllers/authController.js";
import googleAuthMiddleware from "../middlewares/googleAuthMiddleware.js";

const router = Router();

router.post("/google", googleAuthMiddleware, authenticateGoogleUser);
router.get("/logout", logout);

export default router;
