import { Request, Response, NextFunction } from "express";
import { faceService } from "../services/face.service";
import { enrollFaceSchema } from "../validators/face.validator";

export const faceController = {
    // POST /api/face/enroll — Admin đăng ký hộ (ảnh tĩnh, đã trích descriptor ở client)
    async enroll(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = enrollFaceSchema.parse(req.body);
            const result = await faceService.enroll(dto);

            res.status(201).json({
                success: true,
                statusCode: 201,
                message: "Đăng ký khuôn mặt thành công",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/face/profiles — toàn bộ descriptor cho Kiosk (Admin)
    async getAllForKiosk(req: Request, res: Response, next: NextFunction) {
        try {
            const profiles = await faceService.getAllForKiosk();

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Face profiles retrieved",
                data: { profiles },
            });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/face/me — descriptor của chính người đăng nhập (Self Check-in)
    async getMyProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const profile = await faceService.getMyProfile(userId);

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: profile
                    ? "Face profile retrieved"
                    : "Bạn chưa đăng ký khuôn mặt",
                data: { profile },
            });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/face/enrollable-users — danh sách để Admin chọn khi đăng ký
    async getEnrollableUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await faceService.getEnrollableUsers();

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Users retrieved",
                data: { users },
            });
        } catch (error) {
            next(error);
        }
    },

    // DELETE /api/face/:userId — Admin xoá face profile của 1 người
    async deleteProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId as string;
            await faceService.deleteProfile(userId);

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: "Đã xoá face profile",
            });
        } catch (error) {
            next(error);
        }
    },
};
