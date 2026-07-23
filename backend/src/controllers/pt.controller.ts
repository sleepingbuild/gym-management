import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";

const getMyStudents = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const trainerId = req.user!.userId;

        // Lay danh sach hoc vien tu cac booking da CONFIRMED/COMPLETED voi PT nay
        const bookings = await prisma.booking.findMany({
            where: {
                trainerId,
                status: { in: ["CONFIRMED", "COMPLETED"] },
            },
            include: {
                member: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phone: true,
                        userMembership: {
                            select: {
                                plan: { select: { name: true } },
                                status: true,
                            },
                        },
                    },
                },
            },
            orderBy: { date: "desc" },
        });

        // Gop theo tung member, chi lay booking gan nhat
        const studentMap = new Map();
        for (const booking of bookings) {
            if (!studentMap.has(booking.member.id)) {
                studentMap.set(booking.member.id, {
                    id: booking.member.id,
                    fullName: booking.member.fullName,
                    email: booking.member.email,
                    phone: booking.member.phone,
                    membership:
                        booking.member.userMembership?.plan.name ??
                        "Chưa có gói",
                    lastBookingDate: booking.date,
                });
            }
        }

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Students retrieved",
            data: { students: Array.from(studentMap.values()) },
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
        const trainerId = req.user!.userId;
        const { status, date } = req.query as {
            status?: string;
            date?: string;
        };

        const where: {
            trainerId: string;
            status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
            date?: { gte: Date; lt: Date };
        } = { trainerId };

        if (
            status &&
            ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].includes(status)
        ) {
            where.status = status as
                | "PENDING"
                | "CONFIRMED"
                | "CANCELLED"
                | "COMPLETED";
        }

        if (date) {
            const start = new Date(date);
            const end = new Date(start);
            end.setDate(end.getDate() + 1);
            where.date = { gte: start, lt: end };
        }

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                member: { select: { id: true, fullName: true, email: true } },
            },
            orderBy: { date: "asc" },
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

const getMyStats = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const trainerId = req.user!.userId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [totalStudents, todayBookings, pendingBookings] =
            await Promise.all([
                prisma.booking.findMany({
                    where: {
                        trainerId,
                        status: { in: ["CONFIRMED", "COMPLETED"] },
                    },
                    distinct: ["memberId"],
                    select: { memberId: true },
                }),
                prisma.booking.count({
                    where: {
                        trainerId,
                        date: { gte: today, lt: tomorrow },
                        status: { in: ["CONFIRMED", "COMPLETED"] },
                    },
                }),
                prisma.booking.count({
                    where: { trainerId, status: "PENDING" },
                }),
            ]);

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Stats retrieved",
            data: {
                totalStudents: totalStudents.length,
                todayBookings,
                pendingBookings,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const ptController = { getMyStudents, getMyBookings, getMyStats };
