import { prisma } from "../config/prisma";
import { AppError } from "../utils/errors";
import { randomBytes } from "crypto";

export const attendanceService = {
    // Generate QR code for check-in
    async generateQR(userId: string, duration: number = 5) {
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new AppError(404, "User not found", "USER_001");
        }

        // Generate unique QR code
        const qrCode = randomBytes(32).toString("hex");
        const qrExpiry = new Date();
        qrExpiry.setMinutes(qrExpiry.getMinutes() + duration);

        // Save to database
        const attendance = await prisma.attendance.create({
            data: {
                userId,
                qrCode,
                qrExpiry,
                checkInTime: new Date(),
                notes: `QR generated at ${new Date().toISOString()}`,
            },
        });

        return {
            attendanceId: attendance.id,
            qrCode: attendance.qrCode,
            qrExpiry: attendance.qrExpiry,
        };
    },

    // Check-in with QR code
    async checkIn(userId: string, qrCode: string) {
        // Find attendance record with valid QR
        const attendance = await prisma.attendance.findFirst({
            where: {
                qrCode,
                userId,
                checkOutTime: null,
                qrExpiry: {
                    gt: new Date(),
                },
            },
        });

        if (!attendance) {
            throw new AppError(
                400,
                "Invalid or expired QR code",
                "ATTENDANCE_001",
            );
        }

        // Update check-in time
        const updated = await prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                checkInTime: new Date(),
                notes: `Checked in at ${new Date().toISOString()}`,
            },
        });

        return updated;
    },

    // Check-out
    async checkOut(userId: string, attendanceId: string) {
        const attendance = await prisma.attendance.findFirst({
            where: {
                id: attendanceId,
                userId,
                checkOutTime: null,
            },
        });

        if (!attendance) {
            throw new AppError(
                404,
                "Active attendance record not found",
                "ATTENDANCE_002",
            );
        }

        const updated = await prisma.attendance.update({
            where: { id: attendanceId },
            data: {
                checkOutTime: new Date(),
                notes: `Checked out at ${new Date().toISOString()}`,
            },
        });

        return updated;
    },

    // Get attendance history
    async getHistory(userId: string, limit: number = 50) {
        const records = await prisma.attendance.findMany({
            where: { userId },
            orderBy: { checkInTime: "desc" },
            take: limit,
        });
        return records;
    },

    // Get attendance stats
    async getStats(userId: string) {
        const total = await prisma.attendance.count({
            where: { userId },
        });

        const thisMonth = await prisma.attendance.count({
            where: {
                userId,
                checkInTime: {
                    gte: new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        1,
                    ),
                },
            },
        });

        const today = await prisma.attendance.count({
            where: {
                userId,
                checkInTime: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
        });

        return { total, thisMonth, today };
    },
};
