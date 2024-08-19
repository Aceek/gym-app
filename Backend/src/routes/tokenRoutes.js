import express from "express";
import tokenController from "../controllers/auth/tokenController.js";
import { validateRefreshToken } from "../utils/validators/tokenValidators.js";
import validationMiddleware from "../middlewares/validation/validationMiddleware.js";
import jwtMiddleware from "../middlewares/auth/jwtMiddleware.js";

const router = express.Router();

router.post(
  "/refresh-token",
  validateRefreshToken,
  validationMiddleware,
  jwtMiddleware,
  tokenController.refreshToken
);

export default router;
