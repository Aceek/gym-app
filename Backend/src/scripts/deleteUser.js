import prisma from "../config/prismaClient.js";

const deleteAllUsers = async () => {
  try {
    await prisma.user.deleteMany({});
    console.log('All users have been deleted.');
  } catch (error) {
    console.error('Error deleting users:', error);
  } finally {
    await prisma.$disconnect();
  }
};

deleteAllUsers();
