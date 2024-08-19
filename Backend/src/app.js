import express from "express";
import authRoutes from "./routes/authRoutes.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import { prisma } from "./config/prismaClient.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "./utils/responseHandler.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/token", tokenRoutes);
app.use("/api/protected", protectedRoutes);

// simple test route
app.get("/test-db", async (req, res) => {
  try {
    await prisma.$connect();
    const message = "Database connection successful!";
    return sendSuccessResponse(res, null, message, 200);
  } catch (error) {
    return sendErrorResponse(res, "Database connection failed!", 500);
  }
});

app.get("/api/health", (req, res) => {
  console.log("Health check");
  return sendSuccessResponse(res, null, "Health check successful", 200);
});

export default app;
