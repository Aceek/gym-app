import prisma from "../config/prismaClient.js";

const viewUsers = async () => {
  try {
    await prisma.$connect();
    const users = await prisma.user.findMany();
    console.log(users);
  } catch (err) {
    console.error('Error fetching users:', err);
  } finally {
    await prisma.$disconnect();
  }
};

viewUsers();
