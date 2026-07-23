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

        // Kiem tra trung lich (cung trainer, cung ngay, cung khung gio, chua bi huy)
        const bookingDate = new Date(date);
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
    createBooking,
    getMyBookings,
    cancelBooking,
};