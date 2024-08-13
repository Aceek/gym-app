import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

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

export const createUser = async (email, password, displayName) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      displayName,
    },
  });
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

export const verifyUser = async (user) => {
  return prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true },
  });
};

export const setResetTokenAndExpiration = async (user, token) => {
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  return prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpiration: expiration },
  });
};

export const isResetTokenValid = (user) => {
  return user.resetTokenExpiration > new Date();
};

export const resetPassword = async (user, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiration: null,
    },
  });
};

export default {
  findOrCreateUser,
  createUser,
  findUserByEmail,
  verifyPassword,
  findUserById,
  verifyUser,
  setResetTokenAndExpiration,
  isResetTokenValid,
  resetPassword,
};
