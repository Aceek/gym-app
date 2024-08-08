// src/controllers/authController.js
import dotenv from "dotenv";
import userService from "../services/userService.js";
import tokenService from "../services/tokenService.js";

dotenv.config();

export const authenticateGoogleUser = async (req, res) => {
  const googleUser = req.googleUser;
  try {
    const { user, created } = await userService.findOrCreateUser(googleUser);
    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = tokenService.generateRefreshToken(user);

    res.status(200).json({
      message: created ? "User created" : "User logged in",
      accessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  req.logout();
  res.redirect("/");
};
