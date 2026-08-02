import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/generateToken";
import { AppError, ErrorCodes } from "../utils/errors";
import { Role } from "@prisma/client";
import { TokenPayload } from "../types/auth.types";

declare module "express-serve-static-core" {
    interface Request {
        user?: TokenPayload;
    }
}

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError(401, ErrorCodes.AUTH_006, "AUTH_006");
        }

        const token = authHeader.split(" ")[1];
        const payload = verifyAccessToken(token);
        req.user = payload;

        next();
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else {
            next(new AppError(401, ErrorCodes.AUTH_006, "AUTH_006"));
        }
    }
};

export const authorize = (...allowedRoles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError(401, ErrorCodes.AUTH_006, "AUTH_006"));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(
                new AppError(
                    403,
                    "Access denied. Insufficient permissions.",
                    "AUTH_010",
                ),
            );
        }

        next();
    };
};
