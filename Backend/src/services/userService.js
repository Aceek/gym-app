import bcrypt from "bcrypt";
import { prisma } from "../config/prismaClient.js";
import tokenService from "./tokenService.js";
import emailService from "./emailService.js";

export const findOrCreateUser = async (googleUser) => {
  try {
    const user = await prisma.user.upsert({
      where: { googleId: googleUser.id },
      update: {},
      create: {
        googleId: googleUser.id,
        email: googleUser.email,
        displayName: googleUser.displayName,
        photo: googleUser.photo,
      },
    });
    const created = !user.updatedAt;
    return { user, created };
  } catch (error) {
    throw new Error("Error finding or creating user");
  }
};

export const createUser = async (
  email,
  password,
  displayName,
  prismaClient = prisma
) => {
  console.log("Create user has been called with email:", email);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prismaClient.user.create({
      data: {
        email,
        password: hashedPassword,
        displayName,
      },
    });
    console.log(`User created with id: ${user.id}`);
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const verifyPassword = async (user, password) => {
  return bcrypt.compare(password, user.password);
};

export const verifyUser = async (userId) => {
  return prisma.user.update({
    where: { id: userId },
    data: { isVerified: true },
  });
};

export const setResetToken = async (user, token) => {
  return prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token },
  });
};

export const resetPassword = async (user, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
    },
  });
};

export const updateUserWithToken = async (
  userId,
  confirmationToken,
  prismaClient = prisma
) => {
  try {
    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: {
        emailConfirmationToken: confirmationToken,
      },
    });
    console.log(
      `User with id: ${userId} updated with email confirmation token.`
    );
    return updatedUser;
  } catch (error) {
    console.error(`Error updating user with email confirmation token:`, error);
    throw new Error("Failed to update user with email confirmation token");
  }
};

export const clearEmailConfirmationToken = async (userId) => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        emailConfirmationToken: null,
      },
    });
    console.log(`Email confirmation token cleared for user id: ${userId}`);
  } catch (error) {
    console.error(
      `Error clearing email confirmation token for user id: ${userId}`,
      error
    );
    throw new Error("Failed to clear email confirmation token");
  }
};

export const registerUserTransaction = async (email, password, displayName) => {
  return prisma.$transaction(async (prisma) => {
    const user = await createUser(email, password, displayName, prisma);

    const confirmationToken = tokenService.generateConfirmationToken(user.id);

    const updatedUser = await updateUserWithToken(
      user.id,
      confirmationToken,
      prisma
    );

    return updatedUser;
  });
};

export const validateUserForLogin = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 400;
    throw error;
  }

  if (!user.isVerified) {
    const error = new Error("Please confirm your email to login");
    error.statusCode = 400;
    throw error;
  }

  const isPasswordValid = await verifyPassword(user, password);
  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 400;
    throw error;
  }

  return user;
};

export const validateUserForConfirmation = async (userId, token) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("Invalid token");
  }

  if (user.isVerified) {
    throw new Error("Email already confirmed");
  }

  if (user.emailConfirmationToken !== token) {
    throw new Error("Invalid token");
  }

  return user;
};

export const confirmUserEmail = async (userId) => {
  await verifyUser(userId);
  await clearEmailConfirmationToken(userId);
};

export const handlePasswordResetRequest = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("No account with that email found");
  }

  const resetToken = tokenService.generateResetToken(user.id);
  await setResetToken(user, resetToken);
  await emailService.sendResetPasswordEmail(user.email, resetToken);

  return user;
};

export const findUserByToken = async (token, secret) => {
  const decoded = tokenService.verifyToken(token, secret);
  const user = await findUserById(decoded.id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export default {
  findOrCreateUser,
  createUser,
  findUserByEmail,
  verifyPassword,
  findUserById,
  verifyUser,
  resetPassword,
  setResetToken,
  updateUserWithToken,
  clearEmailConfirmationToken,
  registerUserTransaction,
  validateUserForLogin,
  validateUserForConfirmation,
  confirmUserEmail,
  handlePasswordResetRequest,
  findUserByToken,
};
