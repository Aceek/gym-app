import redisClient from "../config/redisClient.js";

export const retryConnection = async () => {
  let retries = 5;
  while (retries) {
    try {
      await redisClient.connect();
      console.log("Connected to Redis");
      break;
    } catch (err) {
      console.error("Retrying Redis connection...", err);
      retries -= 1;
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  if (!retries) {
    console.error("Could not connect to Redis after multiple attempts");
    // Implémenter une logique de fallback ou alerter l'administrateur
  }
};

export const isRateLimited = async (key, limit = 3) => {
  const attempts = await redisClient.get(key);
  return attempts && attempts >= limit;
};

export const incrementRateLimit = async (key, expiration = 3600) => {
  await redisClient.multi().incr(key).expire(key, expiration).exec();
};

export default {
  retryConnection,
  isRateLimited,
  incrementRateLimit,
};
