import tokenService from "../../services/tokenService.js";
import emailService from "../../services/emailService.js";
import userService from "../../services/userService.js";
import tokenBlacklistService from "../../services/tokenBlacklistService.js";
import rateLimitService from "../../services/rateLimitService.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../../utils/responseHandler.js";
import redisService from "../../services/redisService.js";
import { AppError } from "../../errors/AppError.js";

export const register = async (req, res) => {
  const { email, password, displayName } = req.body;
  console.log(`Register request received for email: ${email}`);

  try {
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser && !existingUser.isVerified) {
      console.warn(`Attempt to register with an unverified email: ${email}`);
      return sendErrorResponse(res, "Email is not verified", 400, {
        redirect: true,
      });
    } else if (existingUser) {
      console.warn(`Attempt to register with an existing email: ${email}`);
      return sendErrorResponse(res, "Email already in use", 400);
    }

    const { user: newUser, confirmationCode } =
      await userService.registerUserTransaction(email, password, displayName);
    await emailService.sendConfirmationEmailToUser(
      newUser.email,
      confirmationCode
    );

    return sendSuccessResponse(
      res,
      null,
      "User registered successfully. Please check your email to confirm your account.",
      201
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return sendErrorResponse(res, "Internal Server Error", 500);
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

    const data = { accessToken, refreshToken, user };

    return sendSuccessResponse(res, data, "Login succesful", 200);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const redirect = error.redirect || false;
    console.error("Error logging in:", error.message);
    return sendErrorResponse(res, error.message, statusCode, {
      redirect: redirect,
    });
  }
};

export const confirmEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    console.log(`Email confirmation request received with code: ${code}`);

    const user = await userService.validateUserForConfirmationByCode(
      email,
      code
    );

    await userService.verifyUser(user.id);

    console.log(`Email confirmed for user id: ${user.id}`);
    const message = "Email confirmed successfully. You can now login.";
    return sendSuccessResponse(res, null, message, 200);
  } catch (error) {
    if (error instanceof AppError) {
      return sendErrorResponse(res, error.message, error.statusCode);
    }
    console.error("Error confirming email:", error.message);
    return sendErrorResponse(res, error.message, 400);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    console.log(`Forgot password request received for email: ${email}`);

    const rateLimitKey = `forgot_password_${email}`;
    // test purpose to be uncommented
    // await rateLimitService.checkAndIncrementRateLimit(rateLimitKey, 3);

    const user = await userService.handlePasswordResetRequest(email);
    console.log(`Password reset email sent to: ${user.email}`);

    return sendSuccessResponse(res, null, "Password reset email sent", 200);
  } catch (error) {
    if (error.message === "Rate limit exceeded") {
      console.warn(`Rate limit exceeded for email: ${email}`);
      const message = "Too many requests. Please try again later.";
      return sendErrorResponse(res, message, 429);
    } else if (error.message === "No account with that email found") {
      console.warn(
        `Forgot password failed, no account found for email: ${email}`
      );
      return sendErrorResponse(res, error.message, 400);
    } else {
      console.error("Error sending reset email:", error);
      return sendErrorResponse(res, "Error sending reset email", 500);
    }
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    console.log(
      `Password reset request received with code: ${code} for email: ${email}`
    );

    const user = await userService.findUserByEmail(email);
    if (!user) {
      console.warn("User not found for password reset");
      return sendErrorResponse(res, "User not found", 404);
    }
    await redisService.verifyCode(email, code, "resetPassword");

    await userService.resetPassword(user, newPassword);

    console.log(`Password reset successfully for user id: ${user.id}`);

    const message = "Password reset successfully. Please login again.";
    return sendSuccessResponse(res, null, message, 200);
  } catch (error) {
    if (error instanceof AppError) {
      return sendErrorResponse(res, error.message, error.statusCode);
    }
    console.error("Error resetting password:", error);
    return sendErrorResponse(res, "An unexpected error occurred", 500);
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

    const message = "Password changed successfully. Please login again.";
    return sendSuccessResponse(res, null, message, 200);
  } catch (error) {
    if (error.message === "User not found") {
      console.warn(error.message);
      return sendErrorResponse(res, error.message, 400);
    }

    console.error("Error changing password:", error);
    return sendErrorResponse(res, "Error changing password", 500);
  }
};

export const resendConfirmationEmail = async (req, res) => {
  const { email } = req.body;
  try {
    console.log(`Resend confirm email request received for email: ${email}`);

    const user = await userService.findUserByEmail(email);
    if (!user) {
      console.warn(
        `Attempt to resend confirmation email to a non-existent email: ${email}`
      );
      return sendErrorResponse(res, "No account with that email found", 400);
    }

    if (user.isVerified) {
      console.warn(
        `Attempt to resend confirmation email to an already verified email: ${email}`
      );
      return sendErrorResponse(res, "Email is already confirmed", 400);
    }

    const rateLimitKey = `resend_confirmation_${email}`;
    await rateLimitService.checkAndIncrementRateLimit(rateLimitKey, 3);

    const expiryTimeInSeconds = parseInt(
      process.env.CONFIRMATION_CODE_EXPIRY_TIME
    );
    const confirmationCode = await redisService.generateAndStoreCode(
      email,
      "confirmEmail",
      expiryTimeInSeconds
    );

    await emailService.sendConfirmationEmailToUser(
      user.email,
      confirmationCode
    );
    console.log(`Confirmation email re-sent to: ${user.email}`);

    const message = "Confirmation email resent. Please check your inbox.";
    return sendSuccessResponse(res, null, message, 200);
  } catch (error) {
    if (error.message === "Rate limit exceeded") {
      console.warn(`Rate limit exceeded for email: ${email}`);
      const message = "Too many requests. Please try again later.";
      return sendErrorResponse(res, message, 429);
    }

    console.error("Error resending confirmation email:", error);
    const message = "Error resending confirmation email";
    return sendErrorResponse(res, message, 500);
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
      return sendErrorResponse(res, "Missing tokens", 400);
    }

    await tokenBlacklistService.blacklistTokens(token, refreshToken);

    return sendSuccessResponse(res, null, "Logged out successfully", 200);
  } catch (error) {
    console.error("Error during logout:", error);
    return sendErrorResponse(res, "Error during logout", 500);
  }
};
