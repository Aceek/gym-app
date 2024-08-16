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

// simple test route
app.get("/test-db", async (req, res) => {
  try {
    await prisma.$connect();
    res.status(200).send("Database connection successful!");
  } catch (error) {
    res.status(500).send("Database connection failed!");
  }
});

app.get("/api/health", (req, res) => {
  console.log("Health check");
  res.send("Hello World!");
});

export default app;
