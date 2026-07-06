import rateLimit from "express-rate-limit";
import { ErrorCodes } from "../utils/errors";

// Strict limiter for auth endpoints (login, register)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per IP
    skipSuccessfulRequests: true, // Don't count successful logins
    message: {
        success: false,
        statusCode: 429,
        errorCode: "AUTH_008",
        message: ErrorCodes.AUTH_008,
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// General API limiter
export const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: {
        success: false,
        statusCode: 429,
        errorCode: "RATE_001",
        message: ErrorCodes.RATE_001,
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for sensitive endpoints (payment, admin)
export const strictLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // 20 requests per minute
    message: {
        success: false,
        statusCode: 429,
        errorCode: "RATE_002",
        message: "Too many requests to sensitive endpoint",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
