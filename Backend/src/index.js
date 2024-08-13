import express from "express";
import authRoutes from "./routes/authRoutes.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import { prisma } from "./config/prismaClient.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/token", tokenRoutes);
app.use("/api/protected", protectedRoutes);

// Test de connexion à la base de données
app.get("/test-db", async (req, res) => {
  try {
    await prisma.$connect();
    res.status(200).send("Database connection successful!");
  } catch (error) {
    res.status(500).send("Database connection failed!");
  }
});

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