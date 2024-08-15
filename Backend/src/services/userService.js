import bcrypt from "bcrypt";
import { prisma } from "../config/prismaClient.js";

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
  console.log('Create user has been called with email:', email);
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

// export const setResetTokenAndExpiration = async (user, token) => {
//   const expiration = new Date();
//   expiration.setHours(expiration.getHours() + 1);
//   return prisma.user.update({
//     where: { id: user.id },
//     data: { resetToken: token, resetTokenExpiration: expiration },
//   });
// };

// export const isResetTokenValid = (user) => {
//   return user.resetTokenExpiration > new Date();
// };

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

export default {
  findOrCreateUser,
  createUser,
  findUserByEmail,
  verifyPassword,
  findUserById,
  verifyUser,
  // setResetTokenAndExpiration,
  // isResetTokenValid,
  resetPassword,
  setResetToken,
  updateUserWithToken,
  clearEmailConfirmationToken,
};
