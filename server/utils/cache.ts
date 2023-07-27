import redis from "redis";
import dotenv from "dotenv";

dotenv.config();

const portNumber: number = parseInt(
  process.env.ELASTICACHE_REDIS_PORT || process.env.REDIS_PORT || "0"
);

export const redisClient = redis.createClient({
  socket: {
    host: process.env.ELASTICACHE_REDIS_HOST || process.env.REDIS_HOST,
    port: portNumber,
  },
});

redisClient.on("connect", () => {
  console.log("Connected redis client...");
});

redisClient.on("error", (err) => {
  console.log("Redis Client Error", err);
});
