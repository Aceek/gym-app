import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL,
  // password: process.env.REDIS_PASSWORD, // pour plus tard
});

// Gestion des erreurs de connexion
redisClient.on('error', (err) => {
  console.error('Redis client error', err);
});

// Connexion au serveur Redis
redisClient.connect()
  .then(() => {
    console.log('Connected to Redis');
  })
  .catch((err) => {
    console.error('Could not connect to Redis', err);
  });

export default redisClient;
