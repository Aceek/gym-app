import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const testDbConnection = async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export default testDbConnection;
