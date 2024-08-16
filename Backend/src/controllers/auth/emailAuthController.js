import tokenService from "../../services/tokenService.js";
import emailService from "../../services/emailService.js";
import userService from "../../services/userService.js";
import tokenBlacklistService from "../../services/tokenBlacklistService.js";
import rateLimitService from "../../services/rateLimitService.js";

export const register = async (req, res) => {
  const { email, password, displayName } = req.body;
  console.log(`Register request received for email: ${email}`);

  try {
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      console.warn(`Attempt to register with an existing email: ${email}`);
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = await userService.registerUserTransaction(
      email,
      password,
      displayName
    );
    await emailService.sendConfirmationEmailToUser(
      newUser.email,
      newUser.emailConfirmationToken
    );

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

    const user = await userService.validateUserForLogin(email, password);

    const { accessToken, refreshToken } =
      tokenService.generateTokensForUser(user);
    console.log(`Tokens generated for user id: ${user.id}`);

    res.status(200).json({ accessToken, refreshToken, user });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error("Error logging in:", error.message);
    res.status(statusCode).json({ message: error.message });
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

    const user = await userService.validateUserForConfirmation(
      decoded.id,
      token
    );

    await userService.confirmUserEmail(user.id);

    console.log(`Email confirmed for user id: ${user.id}`);
    res.json({ message: "Email confirmed successfully. You can now login." });
  } catch (error) {
    console.error("Error confirming email:", error.message);
    res.status(400).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`Forgot password request received for email: ${email}`);

    const rateLimitKey = `forgot_password_${email}`;
    await rateLimitService.checkAndIncrementRateLimit(rateLimitKey, 3);

    const user = await userService.handlePasswordResetRequest(email);
    console.log(`Password reset email sent to: ${user.email}`);

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    if (error.message === "Rate limit exceeded") {
      console.warn(`Rate limit exceeded for email: ${email}`);
      res
        .status(429)
        .json({ message: "Too many requests. Please try again later." });
    } else if (error.message === "No account with that email found") {
      console.warn(
        `Forgot password failed, no account found for email: ${email}`
      );
      res.status(400).json({ message: error.message });
    } else {
      console.error("Error sending reset email:", error);
      res.status(500).json({ message: "Error sending reset email", error });
    }
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
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

    if (user.resetToken !== token) {
      console.warn("Invalid or expired token for password reset");
      return res.status(400).json({ message: "Invalid or expired token" });
    }

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

export const changePassword = async (req, res) => {
  try {
    const { newPassword, refreshToken } = req.body;
    console.log(`Password change request received with access token.`);

    const authHeader = req.headers["authorization"];
    const accessToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    const user = await userService.findUserByToken(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    await userService.resetPassword(user, newPassword);

    await tokenBlacklistService.blacklistTokens(accessToken, refreshToken);

    console.log(`Password changed successfully for user id: ${user.id}`);

    res.json({
      message: "Password changed successfully. Please login again.",
    });
  } catch (error) {
    if (error.message === "User not found") {
      console.warn(error.message);
      return res.status(400).json({ message: error.message });
    }

    console.error("Error changing password:", error);
    res.status(500).json({ message: "Error changing password", error });
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

    const rateLimitKey = `resend_confirmation_${email}`;
    await rateLimitService.checkAndIncrementRateLimit(rateLimitKey, 3);

    const confirmationToken = tokenService.generateConfirmationToken(user.id);
    await userService.updateUserWithToken(user.id, confirmationToken);

    await emailService.sendConfirmationEmail(user.email, confirmationToken);
    console.log(`Confirmation email re-sent to: ${user.email}`);

    res.json({
      message: "Confirmation email resent. Please check your inbox.",
    });
  } catch (error) {
    if (error.message === "Rate limit exceeded") {
      console.warn(`Rate limit exceeded for email: ${email}`);
      return res
        .status(429)
        .json({ message: "Too many requests. Please try again later." });
    }

    console.error("Error resending confirmation email:", error);
    res
      .status(500)
      .json({ message: "Error resending confirmation email", error });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const authHeader = req.headers["authorization"];
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token || !refreshToken) {
      return res.status(400).json({ message: "Missing tokens" });
    }

    await tokenBlacklistService.blacklistTokens(token, refreshToken);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Error during logout", error });
  }
};
