import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/errors";

export const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction,
) => {
    // Zod Validation Error
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Validation error",
            errorCode: "VALIDATION_001",
            errors: err.issues.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            })),
        });
    }

    // Custom App Error
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            statusCode: err.statusCode,
            errorCode: err.errorCode || "UNKNOWN_ERROR",
            message: err.message,
        });
    }

    // Unknown Error
    console.error("[UNHANDLED ERROR]", err);
    return res.status(500).json({
        success: false,
        statusCode: 500,
        errorCode: "INTERNAL_001",
        message: "Internal server error",
    });
};
