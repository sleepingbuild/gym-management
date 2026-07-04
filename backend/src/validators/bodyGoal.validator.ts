import { z } from 'zod';

export const createBodyGoalSchema = z.object({
    targetWeight: z.number().positive('Weight must be positive').optional(),
    targetBmi: z.number().positive('BMI must be positive').optional(),
    targetBodyFat: z.number().min(0).max(100, 'Body fat must be between 0 and 100').optional(),
    targetMuscle: z.number().positive('Muscle mass must be positive').optional(),
    targetDate: z.string().datetime('Invalid date format'),
    notes: z.string().optional(),
});

export const updateBodyGoalSchema = z.object({
    targetWeight: z.number().positive('Weight must be positive').optional(),
    targetBmi: z.number().positive('BMI must be positive').optional(),
    targetBodyFat: z.number().min(0).max(100, 'Body fat must be between 0 and 100').optional(),
    targetMuscle: z.number().positive('Muscle mass must be positive').optional(),
    targetDate: z.string().datetime('Invalid date format').optional(),
    status: z.enum(['ACTIVE', 'ACHIEVED', 'EXPIRED']).optional(),
    notes: z.string().optional(),
});

export type CreateBodyGoalRequest = z.infer<typeof createBodyGoalSchema>;
export type UpdateBodyGoalRequest = z.infer<typeof updateBodyGoalSchema>;