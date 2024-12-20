const redis = require("redis");
const redisClient = redis.createClient(6379);

// const redisClient = redis.createClient({ url: process.env.REDIS_CONN_STRING });

redisClient
  .connect()
  .then(() => console.log("Connected to Redis"))
  .catch((err) => console.error("Redis connection error:", err));

// redisClient.flushAll();

// redisClient.flushall("ASYNC", function (err, succeeded) {
//   console.log("OK");
// });

module.exports.redisClient = redisClient;
