//Importações
import Redis from "ioredis";

//Conectando ao redis
const redis = new Redis(process.env.REDIS_URL || "");

// Escutando o evento 'connect'
redis.on('connect', () => {
    console.log("Connected to Redis");
});

// Escutando o evento 'error'
redis.on('error', (err) => {
    console.error("Redis connection error:", err);
});

//  Escutando o evento 'ready'
redis.on('ready', () => {
    console.log("Redis is ready to use");
});

//  Escutando o evento 'close'
redis.on('close', () => {
    console.log("Redis connection closed");
});

// Escutando o evento 'reconnecting'
redis.on('reconnecting', (time: any) => {
    console.log(`Reconnecting to Redis in ${time} ms`);
});

export { redis };