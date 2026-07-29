import { prisma } from "../config/prisma";
import { AppError } from "../utils/errors";
import { FaceCheckInResult } from "../types/face.types";

export const faceAttendanceService = {
    /**
     * Điểm danh bằng khuôn mặt cho 1 userId đã được match ở client (Kiosk hoặc Self Check-in).
     * Rẽ nhánh theo role, y hệt luồng bên bản MVC:
     *  - MEMBER: phải có Booking hôm nay (PENDING/CONFIRMED, chưa check-in) mới cho điểm danh.
     *  - PT: dùng chung TrainerCheckIn, chỉ set method = FACE thay vì MANUAL.
     *  - ADMIN: không áp dụng điểm danh.
     * Đây là bổ sung song song — không đụng tới luồng QR (Attendance) hiện có.
     */
    async checkIn(userId: string): Promise<FaceCheckInResult> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.isActive) {
            throw new AppError(
                404,
                "User not found or inactive",
                "FACE_ATT_001",
            );
        }

        if (user.role === "PT") {
            return this.checkInTrainer(userId);
        }

        if (user.role === "MEMBER") {
            return this.checkInMember(userId);
        }

        throw new AppError(
            400,
            "Admin không sử dụng điểm danh bằng khuôn mặt",
            "FACE_ATT_002",
        );
    },

    async checkInTrainer(trainerId: string): Promise<FaceCheckInResult> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existing = await prisma.trainerCheckIn.findUnique({
            where: { trainerId_date: { trainerId, date: today } },
        });

        if (existing) {
            throw new AppError(
                409,
                "Bạn đã chấm công hôm nay rồi",
                "FACE_ATT_003",
            );
        }

        const record = await prisma.trainerCheckIn.create({
            data: {
                trainerId,
                date: today,
                checkedInAt: new Date(),
                method: "FACE",
            },
        });

        return {
            matchedRole: "PT",
            message: "Chấm công bằng khuôn mặt thành công",
            trainerCheckIn: {
                id: record.id,
                checkedInAt: record.checkedInAt!.toISOString(),
            },
        };
    },

    async checkInMember(memberId: string): Promise<FaceCheckInResult> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const booking = await prisma.booking.findFirst({
            where: {
                memberId,
                date: { gte: today, lt: tomorrow },
                status: { in: ["PENDING", "CONFIRMED"] },
                checkInTime: null,
            },
            orderBy: { timeSlot: "asc" },
        });

        if (!booking) {
            throw new AppError(
                400,
                "Không tìm thấy lịch đặt (Booking) hôm nay để điểm danh",
                "FACE_ATT_004",
            );
        }

        const updated = await prisma.booking.update({
            where: { id: booking.id },
            data: {
                checkInTime: new Date(),
                checkInMethod: "FACE",
            },
        });

        return {
            matchedRole: "MEMBER",
            message: "Điểm danh bằng khuôn mặt thành công",
            booking: {
                id: updated.id,
                checkInTime: updated.checkInTime!.toISOString(),
            },
        };
    },
};
