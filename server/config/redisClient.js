require('dotenv').config();
const redis = require('redis');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const client = redis.createClient({
    url: REDIS_URL,
    socket: {
        connectTimeout: 10000,
        tls: REDIS_URL.startsWith('rediss://'),
    },
});

client.on('error', (err) => console.error(' Redis error:', err));
client.on('connect', () => console.log('Connected to Redis'));

(async () => {
    try {
        await client.connect();
    } catch (err) {
        console.error('Redis connection failed:', err);
    }
})();

module.exports = client;
