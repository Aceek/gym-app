import dotenv from "dotenv";
import userService from "../services/userService.js";

dotenv.config();

export const authenticateGoogleUser = async (req, res) => {
  const googleUser = req.googleUser;
  try {
    const { user, created } = await userService.findOrCreateUser(googleUser);
    res.status(200).json({
      message: created ? "User created" : "User logged in",
      user,
    });
    console.log(created ? "User created" : "User logged in");
    console.log("Name of user: " + googleUser.displayName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  req.logout();
  res.redirect("/");
};
