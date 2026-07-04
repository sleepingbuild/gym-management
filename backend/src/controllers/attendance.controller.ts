import { Request, Response, NextFunction } from 'express';
import { attendanceService } from '../services/attendance.service';
import { checkInSchema, checkOutSchema, generateQRSchema } from '../validators/attendance.validator';

export const attendanceController = {
    // Generate QR code
    async generateQR(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const { duration } = generateQRSchema.parse(req.query);

            const result = await attendanceService.generateQR(userId, duration);

            res.status(201).json({
                success: true,
                statusCode: 201,
                message: 'QR code generated successfully',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    // Check-in
    async checkIn(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const { qrCode } = req.body;

            if (!qrCode) {
                throw new Error('QR code is required');
            }

            const result = await attendanceService.checkIn(userId, qrCode);

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Check-in successful',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    // Check-out
    async checkOut(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const { attendanceId, notes } = checkOutSchema.parse(req.body);

            const result = await attendanceService.checkOut(userId, attendanceId);

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Check-out successful',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    // Get history
    async getHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

            const records = await attendanceService.getHistory(userId, limit);

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Attendance history retrieved',
                data: { records, count: records.length },
            });
        } catch (error) {
            next(error);
        }
    },

    // Get stats
    async getStats(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;

            const stats = await attendanceService.getStats(userId);

            res.status(200).json({
                success: true,
                statusCode: 200,
                message: 'Attendance stats retrieved',
                data: stats,
            });
        } catch (error) {
            next(error);
        }
    },
};