import jwt from "jsonwebtoken";
import redisClient from "../config/redisClient.js";

export const addToBlacklist = async (token, expiryTimeInSeconds) => {
  try {
    await redisClient.set(token, "revoked", "EX", expiryTimeInSeconds);
    console.log(`Token added to blacklist: ${token}`);
  } catch (error) {
    console.error("Error adding token to blacklist:", error);
    throw new Error("Failed to add token to blacklist");
  }
};

export const calculateTokenExpiry = (token) => {
  try {
    const decodedToken = jwt.decode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const expiryTimeInSeconds = decodedToken.exp - currentTime;
    return expiryTimeInSeconds > 0 ? expiryTimeInSeconds : 0;
  } catch (error) {
    console.error("Error calculating token expiry:", error);
    return 0;
  }
};

export const isTokenBlacklisted = async (token) => {
  try {
    const result = await redisClient.get(token);
    return result !== null;
  } catch (error) {
    console.error("Error checking token in Redis:", error);
    throw new Error("Failed to check token in Redis");
  }
};
