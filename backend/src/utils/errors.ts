export class AppError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AppError";
    }
}

// Auth Error Codes
// AUTH_001: Invalid email format
// AUTH_002: Password too short
// AUTH_003: User not found
// AUTH_004: Invalid password
// AUTH_005: Email already exists
// AUTH_006: Invalid or expired token

// Membership Error Codes
// MEMBERSHIP_001: Plan ID is required
// MEMBERSHIP_002: Plan not found or inactive
// MEMBERSHIP_003: User already has an active membership
// MEMBERSHIP_004: User not found
