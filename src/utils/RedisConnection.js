// import { createClient } from "redis";
// import { APP_CONFIG } from "../config/index.js";

// const clients = {};

// let maxRetryCount = 10;

// function initRedisConnectionAsync() {
//     const url = `redis://${APP_CONFIG.redis.host}:${APP_CONFIG.redis.port}`;
//     const redisClient = createClient({ url });

//     redisClient.connect();

//     clients.redisClient = redisClient;

//     redisClient.on("connect", () => console.log("Redis connected"));

//     redisClient.on("end", () => console.log("Redis disconnected"));

//     redisClient.on("reconnecting", () => {
//         console.log("Redis reconnecting");

//         maxRetryCount--;
//         if (maxRetryCount === 0) {
//             process.exit(1);
//         }
//     });

//     redisClient.on("error", (error) => {
//         console.log("Redis error", error);
//     });
// }

// function getRedisClient() {
//     return clients.redisClient;
// }

// export const RedisClient = {
//     initRedisConnectionAsync,
//     getRedisClient,
// };
