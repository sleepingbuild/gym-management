import { Request, Response, NextFunction } from "express";
import { bodyProgressService } from "../services/bodyProgress.service";
import {
    createBodyProgressSchema,
    updateBodyProgressSchema,
} from "../validators/bodyProgress.validator";

export const bodyProgressController = {
    // Create new progress record
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = createBodyProgressSchema.parse(req.body);

            // Convert recordedAt string to Date if provided
            const dto = {
                ...validatedData,
                recordedAt: validatedData.recordedAt
                    ? new Date(validatedData.recordedAt)
                    : undefined,
            };

            const userId = req.user!.userId;
            const record = await bodyProgressService.create(userId, dto);

            res.status(201).json({
                success: true,
                statusCode: 201,
                message: "Progress record created successfully",
                data: record,
            });
        } catch (err) {
            next(err);
        }
    },

    // Get all progress records
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const limit = req.query.limit
                ? parseInt(req.query.limit as string)
                : 50;

            const records = await bodyProgressService.getAll(userId, limit);

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Progress records retrieved",
                data: { records, count: records.length },
            });
        } catch (err) {
            next(err);
        }
    },

    // Get latest progress record
    async getLatest(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;

            const record = await bodyProgressService.getLatest(userId);

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: record
                    ? "Latest progress record retrieved"
                    : "No progress records found",
                data: record,
            });
        } catch (err) {
            next(err);
        }
    },

    // Get chart data
    async getChartData(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const days = req.query.days
                ? parseInt(req.query.days as string)
                : 30;

            const data = await bodyProgressService.getChartData(userId, days);

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Chart data retrieved",
                data,
            });
        } catch (err) {
            next(err);
        }
    },

    // Get stats summary
    async getStats(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;

            const stats = await bodyProgressService.getStats(userId);

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: stats ? "Stats retrieved" : "No data available",
                data: stats,
            });
        } catch (err) {
            next(err);
        }
    },

    // Update progress record
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const userId = req.user!.userId;
            const validatedData = updateBodyProgressSchema.parse(req.body);

            // Convert recordedAt string to Date if provided
            const dto = {
                ...validatedData,
                recordedAt: validatedData.recordedAt
                    ? new Date(validatedData.recordedAt)
                    : undefined,
            };

            const record = await bodyProgressService.update(id, userId, dto);

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Progress record updated successfully",
                data: record,
            });
        } catch (err) {
            next(err);
        }
    },

    // Delete progress record
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const userId = req.user!.userId;

            await bodyProgressService.delete(id, userId);

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Progress record deleted successfully",
            });
        } catch (err) {
            next(err);
        }
    },
};
