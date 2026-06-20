import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/generateToken";
import { AppError } from "../utils/errors";
import { TokenPayload } from "../types/auth.types";

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
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
            throw new AppError(401, "AUTH_006: No token provided");
        }

        const token = authHeader.split(" ")[1];
        const payload = verifyToken(token);
        req.user = payload;

        next();
    } catch {
        next(new AppError(401, "AUTH_006: Invalid or expired token"));
    }
};
