import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "../../services/tokenBlacklistService.js";
import { sendErrorResponse } from "../../utils/responseHandler.js";

const verifyRefreshToken = async (refreshToken) => {
  try {
    const isBlacklisted = await isTokenBlacklisted(refreshToken);
    if (isBlacklisted) {
      console.log("Refresh token has been revoked");
      throw new Error("Refresh token has been revoked");
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    console.log("Error verifying refresh token:", error.message);
    throw new Error("Invalid refresh token");
  }
};

const jwtMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    return sendErrorResponse(res, "Access token is missing or invalid", 401);
  }

  try {
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      return sendErrorResponse(res, "Token has been revoked", 401);
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;

    const refreshToken = req.body["refreshToken"];
    if (refreshToken) {
      await verifyRefreshToken(refreshToken);
    }

    next();
  } catch (error) {
    console.log("Error verifying token:", error.message);
    return sendErrorResponse(res, "Invalid or expired token", 401);
  }
};

export default jwtMiddleware;
