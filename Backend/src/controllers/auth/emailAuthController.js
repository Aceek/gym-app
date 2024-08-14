import tokenService from "../../services/tokenService.js";
import emailService from "../../services/emailService.js";
import userService from "../../services/userService.js";
import {
  addToBlacklist,
  calculateTokenExpiry,
} from "../../services/tokenBlacklistService.js";
import redisService from "../../services/redisService.js";

export const register = async (req, res) => {
  const { email, password, displayName } = req.body;
  console.log(`Register request received for email: ${email}`);

  const existingUser = await userService.findUserByEmail(email);
  if (existingUser) {
    console.warn(`Attempt to register with an existing email: ${email}`);
    return res.status(400).json({ message: "Email already in use" });
  }

  try {
    const newUser = await prisma.$transaction(async (prisma) => {
      const user = await userService.createUser(
        email,
        password,
        displayName,
        prisma
      );

      const confirmationToken = tokenService.generateConfirmationToken(user.id);

      await userService.updateUserWithToken(user.id, confirmationToken, prisma);

      return user;
    });

    const confirmationToken = newUser.emailConfirmationToken;
    await emailService.sendConfirmationEmail(newUser.email, confirmationToken);
    console.log(`Confirmation email sent to: ${newUser.email}`);

    res.status(201).json({
      message:
        "User registered. Please check your email to confirm your account.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login request received for email: ${email}`);

    const user = await userService.findUserByEmail(email);
    if (!user) {
      console.warn(`Login failed, user not found for email: ${email}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await userService.verifyPassword(user, password);
    if (!isPasswordValid) {
      console.warn(`Login failed, invalid password for email: ${email}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      console.warn(`Login attempt with unverified email: ${email}`);
      return res
        .status(400)
        .json({ message: "Please confirm your email to login" });
    }

    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = tokenService.generateRefreshToken(user);
    console.log(`Tokens generated for user id: ${user.id}`);

    res.json({ accessToken, refreshToken, user });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.query;
    console.log(`Email confirmation request received with token: ${token}`);

    const decoded = tokenService.verifyToken(
      token,
      process.env.EMAIL_CONFIRMATION_SECRET
    );

    const user = await userService.findUserById(decoded.id);
    if (!user) {
      console.warn(`Invalid token for email confirmation: ${token}`);
      return res.status(400).json({ message: "Invalid token" });
    }

    if (user.emailConfirmationToken !== token) {
      console.warn(`Token mismatch for email confirmation: ${token}`);
      return res.status(400).json({ message: "Invalid token" });
    }

    await userService.verifyUser(user.id);

    await userService.clearEmailConfirmationToken(user.id);

    console.log(`Email confirmed for user id: ${user.id}`);
    res.json({ message: "Email confirmed successfully. You can now login." });
  } catch (error) {
    console.error("Error confirming email:", error);
    res.status(500).json({ message: "Error confirming email", error });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`Forgot password request received for email: ${email}`);

    const user = await userService.findUserByEmail(email);
    if (!user) {
      console.warn(
        `Forgot password failed, no account found for email: ${email}`
      );
      return res
        .status(400)
        .json({ message: "No account with that email found" });
    }

    const resetToken = tokenService.generateResetToken(user.id);
    await userService.setResetToken(user, resetToken);
    console.log(`Password reset token generated for user id: ${user.id}`);

    await emailService.sendResetPasswordEmail(user.email, resetToken);
    console.log(`Password reset email sent to: ${user.email}`);

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error sending reset email:", error);
    res.status(500).json({ message: "Error sending reset email", error });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, refreshToken, newPassword } = req.body;
    console.log(`Password reset request received with token: ${token}`);

    const decoded = tokenService.verifyToken(
      token,
      process.env.RESET_PASSWORD_SECRET
    );

    const user = await userService.findUserById(decoded.id);
    if (!user) {
      console.warn("User not found for password reset");
      return res.status(400).json({ message: "User not found" });
    }

    const accessTokenExpiry = calculateTokenExpiry(token);
    const refreshTokenExpiry = calculateTokenExpiry(refreshToken);

    await addToBlacklist(token, accessTokenExpiry);
    await addToBlacklist(refreshToken, refreshTokenExpiry);

    await userService.resetPassword(user, newPassword);
    console.log(`Password reset successfully for user id: ${user.id}`);

    res.json({
      message: "Password reset successfully. Please login again.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password", error });
  }
};

export const resendConfirmationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(
      `Resend confirmation email request received for email: ${email}`
    );

    const user = await userService.findUserByEmail(email);
    if (!user) {
      console.warn(
        `Attempt to resend confirmation email to a non-existent email: ${email}`
      );
      return res
        .status(400)
        .json({ message: "No account with that email found" });
    }

    if (user.isVerified) {
      console.warn(
        `Attempt to resend confirmation email to an already verified email: ${email}`
      );
      return res.status(400).json({ message: "Email is already confirmed" });
    }

    const isLimited = await redisService.isRateLimited(email);
    if (isLimited) {
      return res
        .status(429)
        .json({ message: "Too many requests. Please try again later." });
    }

    await redisService.incrementRateLimit(email);

    const confirmationToken = tokenService.generateConfirmationToken(user.id);

    await userService.updateUserWithToken(user.id, confirmationToken);

    await emailService.sendConfirmationEmail(user.email, confirmationToken);
    console.log(`Confirmation email re-sent to: ${user.email}`);

    res.json({
      message: "Confirmation email resent. Please check your inbox.",
    });
  } catch (error) {
    console.error("Error resending confirmation email:", error);
    res
      .status(500)
      .json({ message: "Error resending confirmation email", error });
  }
};

export const logout = async (req, res) => {
  try {
    const { token, refreshToken } = req.body;

    const accessTokenExpiry = calculateTokenExpiry(token);
    const refreshTokenExpiry = calculateTokenExpiry(refreshToken);

    await addToBlacklist(token, accessTokenExpiry);
    await addToBlacklist(refreshToken, refreshTokenExpiry);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Error during logout", error });
  }
};
