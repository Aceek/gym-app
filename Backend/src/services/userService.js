import bcrypt from "bcrypt";
import { prisma } from "../config/prismaClient.js";
import emailService from "./emailService.js";
import redisService from "./redisService.js";
import tokenService from "./tokenService.js";
import dotenv from "dotenv";

dotenv.config();

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

export const setResetCode = async (user, code) => {
  return prisma.user.update({
    where: { id: user.id },
    data: { resetCode: code },
  });
};

export const resetPassword = async (user, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
    },
  });
};

export const updateUserWithConfirmationCode = async (
  userId,
  confirmationCode,
  prismaClient = prisma
) => {
  try {
    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: {
        emailConfirmationCode: confirmationCode,
      },
    });
    console.log(
      `User with id: ${userId} updated with email confirmation code.`
    );
    return updatedUser;
  } catch (error) {
    console.error(`Error updating user with email confirmation code:`, error);
    throw new Error("Failed to update user with email confirmation code");
  }
};

export const registerUserTransaction = async (email, password, displayName) => {
  return prisma.$transaction(async (prisma) => {
    const user = await createUser(email, password, displayName, prisma);

    const expiryTimeInSeconds = parseInt(
      process.env.CONFIRMATION_CODE_EXPIRY_TIME
    );
    const confirmationCode = await redisService.generateAndStoreCode(
      email,
      "confirmEmail",
      expiryTimeInSeconds
    );

    return { user, confirmationCode };
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

export const validateUserForConfirmationByCode = async (email, code) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email");
  }

  if (user.isVerified) {
    throw new Error("Email already confirmed");
  }

  await redisService.verifyCode(email, code, "confirmEmail");

  return user;
};

// export const handlePasswordResetRequest = async (email) => {
//   const user = await findUserByEmail(email);
//   if (!user) {
//     throw new Error("No account with that email found");
//   }

//   const resetCode = generateConfirmationCode();
//   await setResetCode(user, resetCode);
//   await emailService.sendResetPasswordEmail(user.email, resetCode);

//   return user;
// };

export const handlePasswordResetRequest = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("No account with that email found");
  }

  const expiryTimeInSeconds = parseInt(process.env.RESET_CODE_EXPIRY_TIME);
  const resetCode = await redisService.generateAndStoreCode(
    email,
    "resetPassword",
    expiryTimeInSeconds
  );

  await emailService.sendResetPasswordEmail(user.email, resetCode);

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
  updateUserWithConfirmationCode,
  registerUserTransaction,
  validateUserForLogin,
  validateUserForConfirmationByCode,
  handlePasswordResetRequest,
  findUserByToken,
};
