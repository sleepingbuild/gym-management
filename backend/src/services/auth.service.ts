import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { AppError, ErrorCodes } from "../utils/errors";
import { generateTokens, verifyRefreshToken } from "../utils/generateToken";
import {
    RegisterDTO,
    LoginDTO,
    AuthResponse,
    RefreshTokenResponse,
} from "../types/auth.types";

export const authService = {
    async register(dto: RegisterDTO): Promise<AuthResponse> {
        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new AppError(400, ErrorCodes.AUTH_005, "AUTH_005");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                fullName: dto.fullName,
                phone: dto.phone,
                role: "MEMBER",
                isActive: true,
            },
        });

        // Generate tokens
        const tokens = generateTokens({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                phone: user.phone,
                avatar: user.avatar,
                isActive: user.isActive,
            },
            tokens,
        };
    },

    async login(dto: LoginDTO): Promise<AuthResponse> {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new AppError(404, ErrorCodes.AUTH_003, "AUTH_003");
        }

        // Check if user is active
        if (!user.isActive) {
            throw new AppError(
                403,
                "Account is locked. Please contact admin.",
                "AUTH_009",
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
            dto.password,
            user.password,
        );
        if (!isValidPassword) {
            throw new AppError(401, ErrorCodes.AUTH_004, "AUTH_004");
        }

        // Generate tokens
        const tokens = generateTokens({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                phone: user.phone,
                avatar: user.avatar,
                isActive: user.isActive,
            },
            tokens,
        };
    },

    async refresh(refreshToken: string): Promise<RefreshTokenResponse> {
        try {
            // Verify refresh token
            const payload = verifyRefreshToken(refreshToken);

            // Check if user still exists and is active
            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
            });

            if (!user) {
                throw new AppError(404, ErrorCodes.AUTH_003, "AUTH_003");
            }

            if (!user.isActive) {
                throw new AppError(403, "Account is locked", "AUTH_009");
            }

            // Generate new access token (and optionally new refresh token)
            const tokens = generateTokens({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            return {
                accessToken: tokens.accessToken,
                // Optionally rotate refresh token too
                refreshToken: tokens.refreshToken,
            };
        } catch {
            throw new AppError(401, ErrorCodes.AUTH_006, "AUTH_006");
        }
    },

    async logout(_userId: string): Promise<void> {
        // For JWT, logout is client-side (remove token)
        // But we can implement token blacklist here if needed
        // For now, just return success
        return;
    },
};
