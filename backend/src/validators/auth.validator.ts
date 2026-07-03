import { z } from "zod";
import { ErrorCodes } from "../utils/errors";

export const registerSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email(ErrorCodes.AUTH_001),
    password: z.string().min(8, ErrorCodes.AUTH_002),
    phone: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email(ErrorCodes.AUTH_001),
    password: z.string().min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, ErrorCodes.AUTH_007),
});

export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>;
