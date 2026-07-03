export class AppError extends Error {
    public statusCode: number;
    public errorCode?: string;

    constructor(statusCode: number, message: string, errorCode?: string) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.name = "AppError";
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

// Error Codes Dictionary
export const ErrorCodes = {
    // Auth Errors
    AUTH_001: "Invalid email format",
    AUTH_002: "Password must be at least 8 characters",
    AUTH_003: "User not found",
    AUTH_004: "Invalid password",
    AUTH_005: "Email already exists",
    AUTH_006: "Invalid or expired token",
    AUTH_007: "Refresh token required",
    AUTH_008: "Too many login attempts",

    // Membership Errors
    MEMBERSHIP_001: "Plan ID is required",
    MEMBERSHIP_002: "Plan not found or inactive",
    MEMBERSHIP_003: "User already has an active membership",
    MEMBERSHIP_004: "User not found",

    // AI Errors
    AI_001: "No active membership",
    AI_002: "Daily limit reached",
    AI_003: "Monthly limit reached",
    AI_004: "Message is required",

    // Payment Errors
    PAYMENT_001: "Plan not found",
    PAYMENT_002: "User already has active membership",
    PAYMENT_003: "Plan ID is required",
    PAYMENT_004: "Basic plan is free",

    // Rate Limit Errors
    RATE_001: "Too many requests, please slow down",

    // User Errors
    USER_001: "User not found",
    USER_002: "Cannot lock your own account",
    USER_003: "Invalid role",

    // Body Progress Errors
    PROGRESS_001: "Progress record not found",
    PROGRESS_002: "Invalid progress data",
    PROGRESS_003: "Active membership required to track progress",
} as const;

export type ErrorCode = keyof typeof ErrorCodes;
