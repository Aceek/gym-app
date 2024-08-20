import redisClient from "../config/redisClient.js";
import { generateConfirmationCode } from "./tokenService.js";
import { NotFoundError, ValidationError } from "../errors/AppError.js";

export const generateAndStoreCode = async (
  email,
  type,
  expiryTimeInSeconds
) => {
  const code = generateConfirmationCode();
  const key = `${type}:${email}`;

  try {
    await redisClient.set(key, code, "EX", expiryTimeInSeconds);
    console.log(`Code stored in Redis with key: ${key}`);
    return code;
  } catch (error) {
    console.error("Error storing code in Redis:", error);
    throw new Error("Failed to store code in Redis");
  }
};

export const verifyCode = async (email, code, type) => {
  const key = `${type}:${email}`;

  try {
    const storedCode = await redisClient.get(key);

    if (storedCode === null) {
      console.warn("Code not found or expired");
      throw new NotFoundError("Code not found or expired");
    }

    if (storedCode !== code) {
      console.warn("Invalid code");
      throw new ValidationError("Invalid code");
    }

    await redisClient.del(key);
    console.log(`Code verified and deleted from Redis for key: ${key}`);

    return true;
  } catch (error) {
    console.error("Error verifying code:", error);
    throw error;
  }
};

export default {
  generateAndStoreCode,
  verifyCode,
};
