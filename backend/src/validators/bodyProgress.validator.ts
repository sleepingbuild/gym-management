import { z } from "zod";

export const createBodyProgressSchema = z.object({
    weight: z.number().positive("Weight must be positive"),
    height: z.number().positive("Height must be positive").optional(),
    bodyFat: z
        .number()
        .min(0)
        .max(100, "Body fat must be between 0 and 100")
        .optional(),
    muscleMass: z.number().positive("Muscle mass must be positive").optional(),
    notes: z.string().optional(),
    recordedAt: z.string().datetime().optional(),
});

export const updateBodyProgressSchema = z.object({
    weight: z.number().positive("Weight must be positive").optional(),
    height: z.number().positive("Height must be positive").optional(),
    bodyFat: z
        .number()
        .min(0)
        .max(100, "Body fat must be between 0 and 100")
        .optional(),
    muscleMass: z.number().positive("Muscle mass must be positive").optional(),
    notes: z.string().optional(),
    recordedAt: z.string().datetime().optional(),
});

export type CreateBodyProgressRequest = z.infer<
    typeof createBodyProgressSchema
>;
export type UpdateBodyProgressRequest = z.infer<
    typeof updateBodyProgressSchema
>;
