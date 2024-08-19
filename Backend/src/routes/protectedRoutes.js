import { Router } from "express";
import jwtMiddleware from "../middlewares/auth/jwtMiddleware.js";
import { sendSuccessResponse } from "../utils/responseHandler.js";

const router = Router();

router.get("/protected", jwtMiddleware, (req, res) => {
  const message = "This is a protected route";
  return sendSuccessResponse(res, { user: req.user }, message, 200);
});

router.get("/check-token", jwtMiddleware, (req, res) => {
  return sendSuccessResponse(res, null, "Token is valid", 200);
});

router.post("/check-token-refresh", jwtMiddleware, (req, res) => {
  return sendSuccessResponse(res, null, "Token refresh is valid", 200);
});

export default router;
