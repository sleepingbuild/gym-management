import dotenv from "dotenv";

dotenv.config();

export const JWT_CONFIG = {
    secret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key-change-in-production",
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || "15m",
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
};