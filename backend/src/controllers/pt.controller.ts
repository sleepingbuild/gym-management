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

/**
 * PATCH /pt/bookings/:id/status
 * PT chỉ được đổi trạng thái booking CỦA CHÍNH MÌNH (trainerId khớp user đăng nhập).
 * Giới hạn chuyển trạng thái: PENDING -> CONFIRMED/CANCELLED, CONFIRMED -> COMPLETED/CANCELLED.
 */
const BOOKING_TRANSITIONS: Record<string, string[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["COMPLETED", "CANCELLED"],
    COMPLETED: [],
    CANCELLED: [],
};

const updateBookingStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const trainerId = req.user!.userId;
        const id = req.params.id as string;
        const { status } = req.body as { status: string };

        const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
        if (!validStatuses.includes(status)) {
            res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Trạng thái không hợp lệ",
            });
            return;
        }

        const booking = await prisma.booking.findUnique({ where: { id } });
        if (!booking) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Không tìm thấy lịch đặt",
            });
            return;
        }

        if (booking.trainerId !== trainerId) {
            res.status(403).json({
                success: false,
                statusCode: 403,
                message: "Bạn không có quyền thao tác trên lịch đặt này",
            });
            return;
        }

        if (!BOOKING_TRANSITIONS[booking.status].includes(status)) {
            res.status(400).json({
                success: false,
                statusCode: 400,
                message: `Không thể chuyển trạng thái từ ${booking.status} sang ${status}`,
            });
            return;
        }

        const updated = await prisma.booking.update({
            where: { id },
            data: {
                status: status as
                    | "PENDING"
                    | "CONFIRMED"
                    | "CANCELLED"
                    | "COMPLETED",
            },
            include: {
                member: { select: { id: true, fullName: true, email: true } },
            },
        });

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Cập nhật trạng thái thành công",
            data: { booking: updated },
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

const getCheckinToday = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const trainerId = req.user!.userId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const record = await prisma.trainerCheckIn.findUnique({
            where: { trainerId_date: { trainerId, date: today } },
        });

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Today status retrieved",
            data: {
                checkedIn: !!record,
                checkedInAt: record?.checkedInAt ?? null,
                notes: record?.notes ?? null,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getCheckinHistory = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const trainerId = req.user!.userId;

        const records = await prisma.trainerCheckIn.findMany({
            where: { trainerId },
            orderBy: { date: "desc" },
            take: 30,
        });

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "History retrieved",
            data: {
                history: records.map((r) => ({
                    id: r.id,
                    date: r.date,
                    checkedInAt: r.checkedInAt,
                    notes: r.notes,
                })),
            },
        });
    } catch (error) {
        next(error);
    }
};

const createCheckin = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const trainerId = req.user!.userId;
        const { notes } = req.body as { notes?: string };
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existing = await prisma.trainerCheckIn.findUnique({
            where: { trainerId_date: { trainerId, date: today } },
        });

        if (existing) {
            res.status(409).json({
                success: false,
                statusCode: 409,
                message: "Bạn đã chấm công hôm nay rồi",
            });
            return;
        }

        const record = await prisma.trainerCheckIn.create({
            data: {
                trainerId,
                date: today,
                checkedInAt: new Date(),
                notes: notes ?? null,
            },
        });

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: "Check-in thành công",
            data: { checkin: record },
        });
    } catch (error) {
        next(error);
    }
};

const getMyClients = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const trainerId = req.user!.userId;

        const bookings = await prisma.booking.findMany({
            where: {
                trainerId,
                status: { in: ["CONFIRMED", "COMPLETED"] },
            },
            include: {
                member: { select: { id: true, fullName: true, email: true } },
            },
            orderBy: { date: "desc" },
        });

        const clientMap = new Map<
            string,
            {
                id: string;
                fullName: string;
                email: string;
                age: number | null;
                healthStatus: string | null;
                goal: string | null;
                totalSessions: number;
                lastSessionDate: Date;
            }
        >();

        for (const booking of bookings) {
            const existing = clientMap.get(booking.member.id);
            if (!existing) {
                clientMap.set(booking.member.id, {
                    id: booking.member.id,
                    fullName: booking.member.fullName,
                    email: booking.member.email,
                    age: booking.age,
                    healthStatus: null,
                    goal: null,
                    totalSessions: 1,
                    lastSessionDate: booking.date,
                });
            } else {
                existing.totalSessions += 1;
            }
        }

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Clients retrieved",
            data: { clients: Array.from(clientMap.values()) },
        });
    } catch (error) {
        next(error);
    }
};

const getMyClientsProgress = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const trainerId = req.user!.userId;

        const bookings = await prisma.booking.findMany({
            where: {
                trainerId,
                status: { in: ["CONFIRMED", "COMPLETED"] },
            },
            include: { member: { select: { id: true, fullName: true, email: true } } },
            distinct: ["memberId"],
        });

        const progress = await Promise.all(
            bookings.map(async (booking) => {
                const latest = await prisma.bodyProgress.findFirst({
                    where: { userId: booking.member.id },
                    orderBy: { recordedAt: "desc" },
                });

                return {
                    clientId: booking.member.id,
                    fullName: booking.member.fullName,
                    email: booking.member.email,
                    weight: latest?.weight ?? null,
                    bmi: latest?.bmi ?? null,
                    bodyFat: latest?.bodyFat ?? null,
                    muscleMass: latest?.muscleMass ?? null,
                    recordedAt: latest?.recordedAt ?? null,
                };
            }),
        );

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Progress retrieved",
            data: { progress },
        });
    } catch (error) {
        next(error);
    }
};

const getMyDashboard = async (
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

        const [totalStudents, todayBookingsRaw, upcomingBookings, pendingConfirmation] =
            await Promise.all([
                prisma.booking.findMany({
                    where: {
                        trainerId,
                        status: { in: ["CONFIRMED", "COMPLETED"] },
                    },
                    distinct: ["memberId"],
                    select: { memberId: true },
                }),
                prisma.booking.findMany({
                    where: {
                        trainerId,
                        date: { gte: today, lt: tomorrow },
                        status: { in: ["CONFIRMED", "COMPLETED"] },
                    },
                    include: {
                        member: { select: { fullName: true } },
                    },
                    orderBy: { timeSlot: "asc" },
                }),
                prisma.booking.count({
                    where: {
                        trainerId,
                        date: { gt: tomorrow },
                        status: "CONFIRMED",
                    },
                }),
                prisma.booking.count({
                    where: { trainerId, status: "PENDING" },
                }),
            ]);

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Dashboard retrieved",
            data: {
                totalStudents: totalStudents.length,
                todayBookings: todayBookingsRaw.length,
                upcomingBookings,
                pendingConfirmation,
                todaySessions: todayBookingsRaw.map((b) => ({
                    id: b.id,
                    timeSlot: b.timeSlot,
                    memberName: b.member.fullName,
                    status: b.status,
                })),
            },
        });
    } catch (error) {
        next(error);
    }
};

export const ptController = {
    getMyStudents,
    getMyBookings,
    updateBookingStatus,
    getMyStats,
    getCheckinToday,
    getCheckinHistory,
    createCheckin,
    getMyClients,
    getMyClientsProgress,
    getMyDashboard,
};