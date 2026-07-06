import { z } from "zod";

export const checkInSchema = z.object({
    location: z.string().optional(),
});

export const checkOutSchema = z.object({
    attendanceId: z.string().min(1, "Attendance ID is required"), // Sửa thành string bình thường
    notes: z.string().optional(),
});

export const generateQRSchema = z.object({
    duration: z.coerce.number().min(1).max(60).default(5),
});
