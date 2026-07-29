import { z } from "zod";

// 128 chiều theo FaceRecognitionNet của face-api.js
const descriptorSchema = z.array(z.number()).length(128, "Descriptor phải có đúng 128 chiều");

export const enrollFaceSchema = z.object({
    userId: z.string().min(1, "userId is required"),
    descriptors: z
        .array(descriptorSchema)
        .min(1, "Cần ít nhất 1 ảnh để đăng ký khuôn mặt")
        .max(5, "Tối đa 5 ảnh mỗi lần đăng ký"),
});

export const faceCheckInSchema = z.object({
    userId: z.string().min(1, "userId is required"),
});
