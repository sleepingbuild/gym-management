import { z } from "zod";

export const registerSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("AUTH_001: Invalid email format"),
    password: z
        .string()
        .min(8, "AUTH_002: Password must be at least 8 characters"),
});

export const loginSchema = z.object({
    email: z.string().email("AUTH_001: Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
