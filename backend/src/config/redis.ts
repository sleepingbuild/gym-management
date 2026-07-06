import Redis from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD || "",
    retryStrategy: (times) => {
        if (times > 3) {
            console.log("⚠️ Redis connection failed, continuing without cache");
            return null;
        }
        return Math.min(times * 50, 2000);
    },
    maxRetriesPerRequest: 3,
});

redis.on("connect", () => {
    console.log("✅ Redis connected");
});

redis.on("error", (error) => {
    console.log("⚠️ Redis error:", error.message);
});

export const cache = {
    async get<T>(key: string): Promise<T | null> {
        try {
            const data = await redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    },

    async set(key: string, value: unknown, ttl?: number): Promise<void> {
        try {
            const str = JSON.stringify(value);
            if (ttl) {
                await redis.setex(key, ttl, str);
            } else {
                await redis.set(key, str);
            }
        } catch (error) {
            console.error("Cache set error:", error);
        }
    },

    async delete(key: string): Promise<void> {
        try {
            await redis.del(key);
        } catch (error) {
            console.error("Cache delete error:", error);
        }
    },

    async clear(pattern: string): Promise<void> {
        try {
            const keys = await redis.keys(pattern);
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        } catch (error) {
            console.error("Cache clear error:", error);
        }
    },

    // Invalidate cache by prefix
    async invalidate(prefix: string): Promise<void> {
        await this.clear(`${prefix}:*`);
    },
};

export default redis;
