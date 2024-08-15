import app from "./app.js";
import { prisma } from "./config/prismaClient.js";

const startServer = async () => {
  try {
    await prisma.$connect();
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
