import { Request, Response, NextFunction } from "express";
import { bodyGoalService } from "../services/bodyGoal.service";
import {
    createBodyGoalSchema,
    updateBodyGoalSchema,
} from "../validators/bodyGoal.validator";

export const bodyGoalController = {
    // Create goal
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const dto = createBodyGoalSchema.parse(req.body);

            const goal = await bodyGoalService.create(userId, {
                ...dto,
                targetDate: new Date(dto.targetDate),
            });

            res.status(201).json({
                success: true,
                statusCode: 201,
                message: "Goal created successfully",
                data: goal,
            });
        } catch (error) {
            next(error);
        }
    },

    // Get current goal
    async getCurrent(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;

            const goal = await bodyGoalService.getCurrent(userId);

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: goal ? "Goal retrieved" : "No active goal found",
                data: goal,
            });
        } catch (error) {
            next(error);
        }
    },

    // Update goal
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const dto = updateBodyGoalSchema.parse(req.body);

            const goal = await bodyGoalService.update(userId, {
                ...dto,
                targetDate: dto.targetDate
                    ? new Date(dto.targetDate)
                    : undefined,
            });

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Goal updated successfully",
                data: goal,
            });
        } catch (error) {
            next(error);
        }
    },

    // Check achievement
    async checkAchievement(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;

            const result = await bodyGoalService.checkAchievement(userId);

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: result.message || "Goal status checked",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    // Delete goal
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;

            await bodyGoalService.delete(userId);

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Goal deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    },
};
