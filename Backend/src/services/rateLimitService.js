import redisClient from "../config/redisClient.js";

export const isRateLimited = async (key, limit = 3) => {
  const attempts = await redisClient.get(key);
  return attempts && attempts >= limit;
};

export const incrementRateLimit = async (key, expiration = 3600) => {
  await redisClient.multi().incr(key).expire(key, expiration).exec();
};

export const checkAndIncrementRateLimit = async (key, limit) => {
  const limitReached = await isRateLimited(key, limit);
  if (limitReached) {
    throw new Error("Rate limit exceeded");
  }
  await incrementRateLimit(key);
};

export default {
  isRateLimited,
  incrementRateLimit,
  checkAndIncrementRateLimit,
};
