import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/errors";
import { BookingStatus } from "@prisma/client";

const getAvailableTrainers = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const trainers = await prisma.trainerProfile.findMany({
            where: { status: "ACTIVE" },
            include: {
                user: {
                    select: { id: true, fullName: true, email: true },
                },
            },
        });

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Trainers retrieved",
            data: { trainers },
        });
    } catch (error) {
        next(error);
    }
};

const timeToMinutes = (t: string): number => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
};

const minutesToTime = (min: number): string =>
    `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/**
 * Sinh các khung giờ 1 tiếng liên tục nằm trọn trong [startTime, endTime).
 * VD: 08:00 -> 17:00 sinh ra 08:00-09:00, 09:00-10:00, ..., 16:00-17:00 (9 khung),
 * thay vì chỉ khớp với danh sách khung giờ cố định như trước.
 */
const generateHourlySlots = (startTime: string, endTime: string): string[] => {
    const startMin = timeToMinutes(startTime);
    const endMin = timeToMinutes(endTime);
    const slots: string[] = [];
    for (let t = startMin; t + 60 <= endMin; t += 60) {
        slots.push(`${minutesToTime(t)}-${minutesToTime(t + 60)}`);
    }
    return slots;
};

/**
 * GET /bookings/trainers/:trainerId/available-slots?date=YYYY-MM-DD
 * Sinh khung giờ 1 tiếng từ CHÍNH ca làm việc thật của HLV hôm đó (không còn
 * dò khớp với danh sách khung giờ cố định), kèm cờ available:
 * - false nếu đã có booking PENDING/CONFIRMED trùng khung giờ
 */
const getAvailableSlots = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const trainerId = req.params.trainerId as string;
        const { date } = req.query as { date?: string };

        if (!date) {
            throw new AppError(400, "BOOKING_006: Thiếu ngày cần kiểm tra");
        }

        // Không dùng setHours/local time để khớp đúng cách specificDate được lưu
        // ("YYYY-MM-DD" -> Date luôn được parse ở UTC midnight).
        const targetDate = new Date(date);
        if (isNaN(targetDate.getTime())) {
            throw new AppError(400, "BOOKING_007: Ngày không hợp lệ");
        }

        const trainerProfile = await prisma.trainerProfile.findUnique({
            where: { userId: trainerId },
        });
        if (!trainerProfile || trainerProfile.status !== "ACTIVE") {
            throw new AppError(404, "BOOKING_002: Trainer not found or inactive");
        }

        const dayOfWeek = targetDate.getUTCDay();
        const nextDate = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);

        const [schedules, existingBookings] = await Promise.all([
            prisma.trainerSchedule.findMany({
                where: {
                    trainerId,
                    OR: [
                        { type: "RECURRING", dayOfWeek },
                        { type: "SPECIFIC_DATE", specificDate: targetDate },
                    ],
                },
            }),
            prisma.booking.findMany({
                where: {
                    trainerId,
                    date: { gte: targetDate, lt: nextDate },
                    status: { in: ["PENDING", "CONFIRMED"] },
                },
                select: { timeSlot: true },
            }),
        ]);

        const bookedSlots = new Set(existingBookings.map((b) => b.timeSlot));

        // Gộp khung giờ sinh ra từ tất cả ca áp dụng hôm đó, khử trùng nếu 2 ca
        // (vd 1 recurring + 1 specific-date) chồng giờ nhau.
        const slotSet = new Set<string>();
        schedules.forEach((s) => {
            generateHourlySlots(s.startTime, s.endTime).forEach((slot) =>
                slotSet.add(slot),
            );
        });

        const slots = Array.from(slotSet)
            .sort()
            .map((slot) => ({
                timeSlot: slot,
                withinWorkingHours: true,
                available: !bookedSlots.has(slot),
            }));

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Available slots retrieved",
            data: { slots, hasSchedule: schedules.length > 0 },
        });
    } catch (error) {
        next(error);
    }
};

const createBooking = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const memberId = req.user!.userId;
        const { trainerId, date, timeSlot, notes } = req.body as {
            trainerId?: string;
            date?: string;
            timeSlot?: string;
            notes?: string;
        };

        if (!trainerId || !date || !timeSlot) {
            throw new AppError(
                400,
                "BOOKING_001: trainerId, date, and timeSlot are required",
            );
        }

        // Kiem tra trainer co ton tai va dang active khong
        const trainerProfile = await prisma.trainerProfile.findUnique({
            where: { userId: trainerId },
        });
        if (!trainerProfile || trainerProfile.status !== "ACTIVE") {
            throw new AppError(404, "BOOKING_002: Trainer not found or inactive");
        }

        // Kiem tra khung gio dat co nam trong ca lam viec that cua HLV khong
        const bookingDate = new Date(date);
        if (isNaN(bookingDate.getTime())) {
            throw new AppError(400, "BOOKING_008: Ngày không hợp lệ");
        }
        const [slotStart, slotEnd] = timeSlot.split("-");
        const dayOfWeek = bookingDate.getUTCDay();
        const schedules = await prisma.trainerSchedule.findMany({
            where: {
                trainerId,
                OR: [
                    { type: "RECURRING", dayOfWeek },
                    { type: "SPECIFIC_DATE", specificDate: bookingDate },
                ],
            },
        });
        const withinWorkingHours = schedules.some(
            (s) => slotStart >= s.startTime && slotEnd <= s.endTime,
        );
        if (!withinWorkingHours) {
            throw new AppError(
                400,
                "BOOKING_009: Huấn luyện viên không làm việc trong khung giờ này",
            );
        }

        // Kiem tra trung lich (cung trainer, cung ngay, cung khung gio, chua bi huy)
        const existing = await prisma.booking.findFirst({
            where: {
                trainerId,
                date: bookingDate,
                timeSlot,
                status: { in: ["PENDING", "CONFIRMED"] },
            },
        });
        if (existing) {
            throw new AppError(
                409,
                "BOOKING_003: This time slot is already booked",
            );
        }

        const booking = await prisma.booking.create({
            data: {
                memberId,
                trainerId,
                date: bookingDate,
                timeSlot,
                notes: notes ?? null,
                status: "PENDING",
            },
            include: {
                trainer: { select: { id: true, fullName: true } },
            },
        });

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: "Booking created successfully",
            data: { booking },
        });
    } catch (error) {
        next(error);
    }
};

const getMyBookings = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const memberId = req.user!.userId;

        const bookings = await prisma.booking.findMany({
            where: { memberId },
            include: {
                trainer: { select: { id: true, fullName: true } },
            },
            orderBy: { date: "desc" },
        });

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Bookings retrieved",
            data: { bookings },
        });
    } catch (error) {
        next(error);
    }
};

const cancelBooking = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const memberId = req.user!.userId;
        const id = req.params.id as string;

        const booking = await prisma.booking.findFirst({
            where: { id, memberId },
        });
        if (!booking) {
            throw new AppError(404, "BOOKING_004: Booking not found");
        }
        if (booking.status === "COMPLETED") {
            throw new AppError(
                400,
                "BOOKING_005: Cannot cancel a completed booking",
            );
        }

        const updated = await prisma.booking.update({
            where: { id },
            data: { status: BookingStatus.CANCELLED },
        });

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Booking cancelled",
            data: { booking: updated },
        });
    } catch (error) {
        next(error);
    }
};

export const bookingController = {
    getAvailableTrainers,
    getAvailableSlots,
    createBooking,
    getMyBookings,
    cancelBooking,
};