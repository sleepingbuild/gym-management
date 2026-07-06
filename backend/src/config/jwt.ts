import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
if (!refreshSecret) {
    throw new Error(
        "JWT_REFRESH_SECRET is not defined in environment variables",
    );
}

export const JWT_CONFIG = {
    secret,
    refreshSecret,
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || "15m",
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
};
