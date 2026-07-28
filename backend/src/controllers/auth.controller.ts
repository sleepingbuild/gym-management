import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
} from "../validators/auth.validator";

export const authController = {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = registerSchema.parse(req.body);
            const result = await authService.register(dto);
            res.status(201).json({
                success: true,
                statusCode: 201,
                message: result.message,
                data: { email: result.email },
            });
        } catch (err) {
            next(err);
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = loginSchema.parse(req.body);
            const result = await authService.login(dto);

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Login successful",
                data: result,
            });
        } catch (err) {
            next(err);
        }
    },

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = refreshTokenSchema.parse(req.body);
            const result = await authService.refresh(refreshToken);

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Token refreshed successfully",
                data: result,
            });
        } catch (err) {
            next(err);
        }
    },

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            // JWT logout is client-side
            // But we can add token to blacklist here if needed
            res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Logout successful",
            });
        } catch (err) {
            next(err);
        }
    },

    async verifyEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.query as { token?: string };
            if (!token) {
                res.status(400).json({
                    success: false,
                    statusCode: 400,
                    message: "Token is required",
                });
                return;
            }
            await authService.verifyEmail(token);
            res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Email verified successfully",
            });
        } catch (err) {
            next(err);
        }
    },
};
