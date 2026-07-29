import { Request, Response, NextFunction } from "express";
import { faceAttendanceService } from "../services/faceAttendance.service";
import { faceCheckInSchema } from "../validators/face.validator";

export const faceAttendanceController = {
    // POST /api/face-attendance/checkin — Kiosk (Admin đứng máy, so khớp với TẤT CẢ mọi người)
    // Admin gửi userId đã match ở client; server không tự tin client, vẫn validate + re-check role/booking.
    async checkIn(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = faceCheckInSchema.parse(req.body);
            const result = await faceAttendanceService.checkIn(userId);

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: result.message,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/face-attendance/checkin/self — Trainer/Member tự điểm danh bằng webcam của chính họ.
    // KHÔNG nhận userId từ client — luôn dùng người đang đăng nhập để tránh điểm danh hộ người khác.
    async selfCheckIn(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const result = await faceAttendanceService.checkIn(userId);

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: result.message,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
};
