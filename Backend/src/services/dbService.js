import { prisma } from "../config/prismaClient.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../utils/responseHandler.js";

const testDbConnection = async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    const message = "Database connection successful!";
    return sendSuccessResponse(res, result[0], message, 200);
  } catch (err) {
    console.error(err);
    return sendErrorResponse(res, "Database connection failed!", 500);
  }
};

export default testDbConnection;
