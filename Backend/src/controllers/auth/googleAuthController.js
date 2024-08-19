// src/controllers/authController.js
import dotenv from "dotenv";
import userService from "../../services/userService.js";
import tokenService from "../../services/tokenService.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseHandler.js";

dotenv.config();

export const authenticateGoogleUser = async (req, res) => {
  const googleUser = req.googleUser;
  try {
    const { user, created } = await userService.findOrCreateUser(googleUser);
    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = tokenService.generateRefreshToken(user);
    console.log("accessToken\n\n", accessToken);

    const message = created ? "User created" : "User logged in";
    const data = { accessToken, refreshToken, user };
    return sendSuccessResponse(res, data, message, 200);
  } catch (error) {
    console.error("Error during authentication:", error);
    return sendErrorResponse(res, "Internal Server Error", 500);
  }
};
