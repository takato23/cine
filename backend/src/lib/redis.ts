import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

let isConnected = false;

export const getRedisClient = async () => {
  if (!isConnected) {
    await redisClient.connect();
    isConnected = true;
  }
  return redisClient;
};

export const disconnectRedis = async () => {
  if (isConnected) {
    await redisClient.disconnect();
    isConnected = false;
  }
};

