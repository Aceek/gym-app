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

export const isRateLimited = async (email, limit = 3) => {
  const rateLimitKey = `resend_confirmation_${email}`;
  const attempts = await redisClient.get(rateLimitKey);
  return attempts && attempts >= limit;
};

export const incrementRateLimit = async (email) => {
  const rateLimitKey = `resend_confirmation_${email}`;
  await redisClient
    .multi()
    .incr(rateLimitKey)
    .expire(rateLimitKey, 3600) // Expire en 1 heure
    .exec();
};

export default {
  retryConnection,
  isRateLimited,
  incrementRateLimit,
};
