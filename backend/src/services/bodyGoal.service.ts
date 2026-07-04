import { prisma } from '../config/prisma';
import { AppError } from '../utils/errors';
import { CreateBodyGoalDTO, UpdateBodyGoalDTO } from '../types/bodyGoal.types';

export const bodyGoalService = {
    // Create goal
    async create(userId: string, dto: CreateBodyGoalDTO) {
        // Check if user has existing goal
        const existing = await prisma.bodyGoal.findUnique({
            where: { userId },
        });

        if (existing) {
            throw new AppError(400, 'User already has a goal. Update existing goal instead.', 'GOAL_001');
        }

        const goal = await prisma.bodyGoal.create({
            data: {
                userId,
                targetWeight: dto.targetWeight,
                targetBmi: dto.targetBmi,
                targetBodyFat: dto.targetBodyFat,
                targetMuscle: dto.targetMuscle,
                targetDate: new Date(dto.targetDate),
                notes: dto.notes,
                status: 'ACTIVE',
            },
        });

        return goal;
    },

    // Get current goal
    async getCurrent(userId: string) {
        const goal = await prisma.bodyGoal.findUnique({
            where: { userId },
        });

        if (!goal) {
            return null;
        }

        // Auto-update status if target date passed
        if (goal.status === 'ACTIVE' && goal.targetDate < new Date()) {
            await prisma.bodyGoal.update({
                where: { userId },
                data: { status: 'EXPIRED' },
            });
            goal.status = 'EXPIRED';
        }

        return goal;
    },

    // Update goal
    async update(userId: string, dto: UpdateBodyGoalDTO) {
        const existing = await prisma.bodyGoal.findUnique({
            where: { userId },
        });

        if (!existing) {
            throw new AppError(404, 'Goal not found', 'GOAL_002');
        }

        const goal = await prisma.bodyGoal.update({
            where: { userId },
            data: {
                targetWeight: dto.targetWeight,
                targetBmi: dto.targetBmi,
                targetBodyFat: dto.targetBodyFat,
                targetMuscle: dto.targetMuscle,
                targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
                status: dto.status,
                notes: dto.notes,
            },
        });

        return goal;
    },

    // Check if goal is achieved based on latest body progress
    async checkAchievement(userId: string) {
        const goal = await prisma.bodyGoal.findUnique({
            where: { userId },
        });

        if (!goal || goal.status !== 'ACTIVE') {
            return { achieved: false, message: 'No active goal found' };
        }

        const latestProgress = await prisma.bodyProgress.findFirst({
            where: { userId },
            orderBy: { recordedAt: 'desc' },
        });

        if (!latestProgress) {
            return { achieved: false, message: 'No progress data found' };
        }

        let achieved = false;
        let message = '';

        if (goal.targetWeight && latestProgress.weight <= goal.targetWeight) {
            achieved = true;
            message = `Target weight ${goal.targetWeight}kg achieved! Current: ${latestProgress.weight}kg`;
        } else if (goal.targetBmi && latestProgress.bmi && latestProgress.bmi <= goal.targetBmi) {
            achieved = true;
            message = `Target BMI ${goal.targetBmi} achieved! Current: ${latestProgress.bmi}`;
        } else if (goal.targetBodyFat && latestProgress.bodyFat && latestProgress.bodyFat <= goal.targetBodyFat) {
            achieved = true;
            message = `Target body fat ${goal.targetBodyFat}% achieved! Current: ${latestProgress.bodyFat}%`;
        }

        if (achieved && goal.status === 'ACTIVE') {
            await prisma.bodyGoal.update({
                where: { userId },
                data: { status: 'ACHIEVED' },
            });
        }

        return { achieved, message };
    },

    // Delete goal
    async delete(userId: string) {
        const existing = await prisma.bodyGoal.findUnique({
            where: { userId },
        });

        if (!existing) {
            throw new AppError(404, 'Goal not found', 'GOAL_002');
        }

        await prisma.bodyGoal.delete({
            where: { userId },
        });

        return { success: true };
    },
};