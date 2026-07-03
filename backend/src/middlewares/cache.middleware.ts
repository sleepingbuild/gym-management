import { Request, Response, NextFunction } from 'express';
import { cache } from '../config/redis';

export const cacheMiddleware = (ttl: number = 60) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        // Skip cache if query parameter 'refresh' is present
        if (req.query.refresh === 'true') {
            return next();
        }

        const key = `cache:${req.originalUrl || req.url}`;

        try {
            const cachedData = await cache.get(key);
            if (cachedData) {
                return res.json(cachedData);
            }

            // Store original send
            const originalJson = res.json.bind(res);

            // Override json method
            res.json = function (data: any) {
                // Cache response (async, don't wait)
                cache.set(key, data, ttl).catch(console.error);
                return originalJson(data);
            };

            next();
        } catch (error) {
            console.error('Cache middleware error:', error);
            next();
        }
    };
};

// Invalidate cache for specific prefix
export const invalidateCache = async (prefix: string) => {
    await cache.invalidate(prefix);
};