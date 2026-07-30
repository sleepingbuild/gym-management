import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/errors";
import { Role, BookingStatus, PaymentStatus, Prisma } from "@prisma/client";

const getStats = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const [totalUsers, activeMembers] = await Promise.all([
            prisma.user.count({ where: { isDeleted: false } }),
            prisma.userMembership.count({ where: { status: "ACTIVE" } }),
        ]);
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Stats retrieved",
            data: { totalUsers, totalMembers: totalUsers, activeMembers },
        });
    } catch (error) {
        next(error);
    }
};

const getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            where: { isDeleted: false },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                role: true,
                isActive: true,
                createdAt: true,
                userMembership: {
                    select: {
                        status: true,
                        expiryDate: true,
                        plan: { select: { name: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Users retrieved",
            data: { users },
        });
    } catch (error) {
        next(error);
    }
};

const toggleUserActive = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const id = req.params.id as string;
        const user = await prisma.user.findFirst({
            where: { id, isDeleted: false },
        });
        if (!user) throw new AppError(404, "USER_001: User not found");
        if (user.id === req.user!.userId)
            throw new AppError(400, "USER_002: Cannot lock your own account");

        const updated = await prisma.user.update({
            where: { id },
            data: { isActive: !user.isActive },
            select: { id: true, fullName: true, email: true, isActive: true },
        });
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: updated.isActive ? "User unlocked" : "User locked",
            data: { user: updated },
        });
    } catch (error) {
        next(error);
    }
};

const updateUserRole = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const id = req.params.id as string;
        const role = req.body.role as string;
        if (!["ADMIN", "PT", "MEMBER"].includes(role))
            throw new AppError(400, "USER_003: Invalid role");

        const user = await prisma.user.findFirst({
            where: { id, isDeleted: false },
        });
        if (!user) throw new AppError(404, "USER_001: User not found");

        const updated = await prisma.user.update({
            where: { id },
            data: { role: role as Role },
            select: { id: true, fullName: true, email: true, role: true },
        });
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "User role updated",
            data: { user: updated },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /admin/revenue
 */
const getRevenue = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const MONTHS_BACK = 6;
        const now = new Date();
        const start = new Date(
            now.getFullYear(),
            now.getMonth() - (MONTHS_BACK - 1),
            1,
        );

        const payments = await prisma.payment.findMany({
            where: {
                status: "SUCCESS",
                createdAt: { gte: start },
            },
            select: { amount: true, createdAt: true },
        });

        const monthMap = new Map<string, number>();
        for (let i = MONTHS_BACK - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            monthMap.set(key, 0);
        }

        for (const p of payments) {
            const key = `${p.createdAt.getFullYear()}-${String(p.createdAt.getMonth() + 1).padStart(2, "0")}`;
            if (monthMap.has(key)) {
                monthMap.set(key, (monthMap.get(key) ?? 0) + p.amount);
            }
        }

        const revenue = Array.from(monthMap.entries()).map(
            ([month, total]) => ({
                month,
                revenue: total,
            }),
        );

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Revenue retrieved",
            data: { revenue },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /admin/memberships/distribution
 */
const getMembershipDistribution = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const grouped = await prisma.userMembership.groupBy({
            by: ["planId"],
            where: { status: "ACTIVE" },
            _count: { _all: true },
        });

        const plans = await prisma.membershipPlan.findMany({
            where: { id: { in: grouped.map((g) => g.planId) } },
            select: { id: true, name: true },
        });
        const planNameMap = new Map(plans.map((p) => [p.id, p.name]));

        const distribution = grouped.map((g) => ({
            name: planNameMap.get(g.planId) ?? "Không xác định",
            value: g._count._all,
        }));

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Membership distribution retrieved",
            data: { distribution },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /admin/memberships
 */
const getAllMembershipPlans = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const plans = await prisma.membershipPlan.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Membership plans retrieved",
            data: { plans },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /admin/memberships
 */
const createMembershipPlan = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { name, price, duration, aiLimit, aiDailyLimit, description } =
            req.body;

        if (!name || typeof name !== "string")
            throw new AppError(400, "PLAN_001: Tên gói không hợp lệ");
        if (typeof price !== "number" || price < 0)
            throw new AppError(400, "PLAN_002: Giá gói không hợp lệ");
        if (!Number.isInteger(duration) || duration <= 0)
            throw new AppError(400, "PLAN_003: Thời hạn (ngày) không hợp lệ");
        if (!Number.isInteger(aiLimit) || (aiLimit < 0 && aiLimit !== -1))
            throw new AppError(400, "PLAN_004: Giới hạn AI/tháng không hợp lệ");
        if (
            !Number.isInteger(aiDailyLimit) ||
            (aiDailyLimit < 0 && aiDailyLimit !== -1)
        )
            throw new AppError(400, "PLAN_005: Giới hạn AI/ngày không hợp lệ");

        const plan = await prisma.membershipPlan.create({
            data: {
                name,
                price,
                duration,
                aiLimit,
                aiDailyLimit,
                description: description ?? null,
            },
        });

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: "Membership plan created",
            data: { plan },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /admin/memberships/:id
 */
const updateMembershipPlan = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const id = req.params.id as string;
        const { name, price, duration, aiLimit, aiDailyLimit, description } =
            req.body;

        const existing = await prisma.membershipPlan.findUnique({
            where: { id },
        });
        if (!existing)
            throw new AppError(404, "PLAN_006: Gói tập không tồn tại");

        if (price !== undefined && (typeof price !== "number" || price < 0))
            throw new AppError(400, "PLAN_002: Giá gói không hợp lệ");
        if (
            duration !== undefined &&
            (!Number.isInteger(duration) || duration <= 0)
        )
            throw new AppError(400, "PLAN_003: Thời hạn (ngày) không hợp lệ");

        const plan = await prisma.membershipPlan.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(price !== undefined && { price }),
                ...(duration !== undefined && { duration }),
                ...(aiLimit !== undefined && { aiLimit }),
                ...(aiDailyLimit !== undefined && { aiDailyLimit }),
                ...(description !== undefined && { description }),
            },
        });

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Membership plan updated",
            data: { plan },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /admin/memberships/:id/toggle-active
 */
const toggleMembershipPlanActive = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const id = req.params.id as string;
        const existing = await prisma.membershipPlan.findUnique({
            where: { id },
        });
        if (!existing)
            throw new AppError(404, "PLAN_006: Gói tập không tồn tại");

        const plan = await prisma.membershipPlan.update({
            where: { id },
            data: { isActive: !existing.isActive },
        });

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: plan.isActive
                ? "Membership plan unlocked"
                : "Membership plan locked",
            data: { plan },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /admin/memberships/:id
 */
const deleteMembershipPlan = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const id = req.params.id as string;
        const existing = await prisma.membershipPlan.findUnique({
            where: { id },
        });
        if (!existing)
            throw new AppError(404, "PLAN_006: Gói tập không tồn tại");

        const inUseCount = await prisma.userMembership.count({
            where: { planId: id },
        });
        if (inUseCount > 0)
            throw new AppError(
                400,
                "PLAN_007: Không thể xóa gói đang có thành viên sử dụng. Hãy khóa gói thay vì xóa.",
            );

        await prisma.membershipPlan.delete({ where: { id } });

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Membership plan deleted",
            data: { id },
        });
    } catch (error) {
        next(error);
    }
};

const trainerSelect = {
    id: true,
    fullName: true,
    email: true,
    phone: true,
    avatar: true,
    isActive: true,
    createdAt: true,
};

/**
 * GET /admin/trainers
 */
const getTrainers = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const trainers = await prisma.trainerProfile.findMany({
            include: { user: { select: trainerSelect } },
            orderBy: { createdAt: "desc" },
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

/**
 * POST /admin/trainers
 */
const createTrainer = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { fullName, email, password, phone, specialties, bio } = req.body;

        if (!fullName || !email || !password || !specialties)
            throw new AppError(
                400,
                "TRAINER_001: Thiếu thông tin bắt buộc (họ tên, email, mật khẩu, chuyên môn)",
            );
        if (typeof password !== "string" || password.length < 8)
            throw new AppError(400, "TRAINER_002: Mật khẩu phải từ 8 ký tự");

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser)
            throw new AppError(400, "TRAINER_003: Email đã được sử dụng");

        const hashedPassword = await bcrypt.hash(password, 12);

        const trainer = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    fullName,
                    email,
                    password: hashedPassword,
                    phone: phone ?? null,
                    role: "PT",
                },
            });

            return tx.trainerProfile.create({
                data: {
                    userId: user.id,
                    specialties,
                    bio: bio ?? null,
                },
                include: { user: { select: trainerSelect } },
            });
        });

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: "Trainer created",
            data: { trainer },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /admin/trainers/:id
 */
const updateTrainer = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const id = req.params.id as string;
        const { fullName, phone, specialties, bio, status } = req.body;

        const existing = await prisma.trainerProfile.findUnique({
            where: { id },
        });
        if (!existing)
            throw new AppError(
                404,
                "TRAINER_004: Không tìm thấy huấn luyện viên",
            );

        const trainer = await prisma.$transaction(async (tx) => {
            if (fullName !== undefined || phone !== undefined) {
                await tx.user.update({
                    where: { id: existing.userId },
                    data: {
                        ...(fullName !== undefined && { fullName }),
                        ...(phone !== undefined && { phone }),
                    },
                });
            }

            return tx.trainerProfile.update({
                where: { id },
                data: {
                    ...(specialties !== undefined && { specialties }),
                    ...(bio !== undefined && { bio }),
                    ...(status !== undefined && { status }),
                },
                include: { user: { select: trainerSelect } },
            });
        });

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Trainer updated",
            data: { trainer },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /admin/trainers/:id
 */
const deleteTrainer = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const id = req.params.id as string;
        const existing = await prisma.trainerProfile.findUnique({
            where: { id },
        });
        if (!existing)
            throw new AppError(
                404,
                "TRAINER_004: Không tìm thấy huấn luyện viên",
            );

        const pendingBookings = await prisma.booking.count({
            where: {
                trainerId: existing.userId,
                status: { in: ["PENDING", "CONFIRMED"] },
            },
        });
        if (pendingBookings > 0)
            throw new AppError(
                400,
                "TRAINER_005: Huấn luyện viên đang có lịch đặt chưa hoàn thành, không thể xóa",
            );

        await prisma.$transaction(async (tx) => {
            await tx.trainerProfile.delete({ where: { id } });
            await tx.user.update({
                where: { id: existing.userId },
                data: { role: "MEMBER" },
            });
        });

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Trainer deleted",
            data: { id },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /admin/bookings
 */
const getBookings = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { status, trainerId, date } = req.query as {
            status?: string;
            trainerId?: string;
            date?: string;
        };

        const where: {
            status?: BookingStatus;
            trainerId?: string;
            date?: { gte: Date; lt: Date };
        } = {};

        if (
            status &&
            ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].includes(status)
        ) {
            where.status = status as BookingStatus;
        }
        if (trainerId) where.trainerId = trainerId;
        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(start);
            end.setDate(end.getDate() + 1);
            where.date = { gte: start, lt: end };
        }

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                member: { select: { id: true, fullName: true, email: true } },
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

const BOOKING_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["COMPLETED", "CANCELLED"],
    COMPLETED: [],
    CANCELLED: [],
};

/**
 * PATCH /admin/bookings/:id/status
 */
const updateBookingStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const id = req.params.id as string;
        const { status } = req.body as { status: string };

        if (
            !["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].includes(status)
        )
            throw new AppError(400, "BOOKING_001: Trạng thái không hợp lệ");

        const existing = await prisma.booking.findUnique({ where: { id } });
        if (!existing)
            throw new AppError(404, "BOOKING_002: Không tìm thấy lịch đặt");

        const allowedNext = BOOKING_TRANSITIONS[existing.status];
        if (!allowedNext.includes(status as BookingStatus))
            throw new AppError(
                400,
                `BOOKING_003: Không thể chuyển trạng thái từ ${existing.status} sang ${status}`,
            );

        const booking = await prisma.booking.update({
            where: { id },
            data: { status: status as BookingStatus },
            include: {
                member: { select: { id: true, fullName: true, email: true } },
                trainer: { select: { id: true, fullName: true } },
            },
        });

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Booking status updated",
            data: { booking },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /admin/payments
 * Query params tùy chọn: status, fromDate, toDate (YYYY-MM-DD), search (khớp mã GD / nội dung / tên / email)
 * Trả kèm { stats } tính trên đúng tập kết quả đã lọc.
 */
const getPayments = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { status, fromDate, toDate, search } = req.query as {
            status?: string;
            fromDate?: string;
            toDate?: string;
            search?: string;
        };

        const where: Prisma.PaymentWhereInput = {};

        if (
            status &&
            ["PENDING", "SUCCESS", "FAILED", "REFUNDED"].includes(status)
        ) {
            where.status = status as PaymentStatus;
        }

        if (fromDate || toDate) {
            where.createdAt = {};
            if (fromDate) where.createdAt.gte = new Date(fromDate);
            if (toDate) {
                const end = new Date(toDate);
                end.setHours(23, 59, 59, 999);
                where.createdAt.lte = end;
            }
        }

        if (search) {
            where.OR = [
                { transactionId: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                {
                    user: {
                        fullName: { contains: search, mode: "insensitive" },
                    },
                },
                { user: { email: { contains: search, mode: "insensitive" } } },
            ];
        }

        const payments = await prisma.payment.findMany({
            where,
            include: {
                user: { select: { id: true, fullName: true, email: true } },
                membershipPlan: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        const stats = {
            totalAmount: payments
                .filter((p) => p.status === "SUCCESS")
                .reduce((sum, p) => sum + p.amount, 0),
            totalCount: payments.length,
            successCount: payments.filter((p) => p.status === "SUCCESS").length,
            pendingCount: payments.filter((p) => p.status === "PENDING").length,
        };

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Payments retrieved",
            data: { payments, stats },
        });
    } catch (error) {
        next(error);
    }
};

const getTrainerCheckins = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const dateParam = (req.query.date as string) || new Date().toISOString().slice(0, 10);
        const date = new Date(dateParam);
        date.setHours(0, 0, 0, 0);
 
        if (isNaN(date.getTime())) {
            throw new AppError(400, "ADMIN_TC_001: date không hợp lệ (định dạng YYYY-MM-DD)");
        }
 
        const trainers = await prisma.trainerProfile.findMany({
            where: { user: { isActive: true, isDeleted: false } },
            include: { user: { select: { id: true, fullName: true } } },
            orderBy: { user: { fullName: "asc" } },
        });
 
        const checkins = await prisma.trainerCheckIn.findMany({
            where: {
                date,
                trainerId: { in: trainers.map((t) => t.userId) },
            },
        });
 
        const checkinByTrainerId = new Map(checkins.map((c) => [c.trainerId, c]));
 
        const rows = trainers.map((t) => {
            const checkin = checkinByTrainerId.get(t.userId);
            return {
                trainerId: t.userId,
                trainerName: t.user.fullName,
                id: checkin?.id ?? null,
                checkedInAt: checkin?.checkedInAt?.toISOString() ?? null,
                notes: checkin?.notes ?? null,
                method: checkin?.method ?? null, // ✨ MANUAL | FACE | null (chưa chấm công)
            };
        });
 
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Trainer check-ins retrieved",
            data: { date: dateParam, rows },
        });
    } catch (error) {
        next(error);
    }
};
 
/**
 * POST /admin/trainer-checkins
 * Body: { trainerId: string, date: string (YYYY-MM-DD) }
 * Admin chấm công thủ công hộ trainer (method = MANUAL).
 */
const createTrainerCheckin = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { trainerId, date: dateParam } = req.body;
 
        if (!trainerId || !dateParam) {
            throw new AppError(400, "ADMIN_TC_002: Thiếu trainerId hoặc date");
        }
 
        const trainer = await prisma.trainerProfile.findUnique({ where: { userId: trainerId } });
        if (!trainer) {
            throw new AppError(404, "ADMIN_TC_003: Không tìm thấy huấn luyện viên");
        }
 
        const date = new Date(dateParam);
        date.setHours(0, 0, 0, 0);
 
        const existing = await prisma.trainerCheckIn.findUnique({
            where: { trainerId_date: { trainerId, date } },
        });
        if (existing) {
            throw new AppError(409, "ADMIN_TC_004: Trainer đã được chấm công ngày này rồi");
        }
 
        const record = await prisma.trainerCheckIn.create({
            data: {
                trainerId,
                date,
                checkedInAt: new Date(),
                method: "MANUAL",
            },
        });
 
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: "Chấm công thành công",
            data: { checkin: record },
        });
    } catch (error) {
        next(error);
    }
};
 
/**
 * DELETE /admin/trainer-checkins/:id
 * Hủy (xoá) 1 bản ghi chấm công.
 */
const deleteTrainerCheckin = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const id = req.params.id as string;
 
        const existing = await prisma.trainerCheckIn.findUnique({ where: { id } });
        if (!existing) {
            throw new AppError(404, "ADMIN_TC_005: Không tìm thấy bản ghi chấm công");
        }
 
        await prisma.trainerCheckIn.delete({ where: { id } });
 
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Đã hủy chấm công",
        });
    } catch (error) {
        next(error);
    }
};
 
export const adminController = {
    getStats,
    getUsers,
    toggleUserActive,
    updateUserRole,
    getRevenue,
    getMembershipDistribution,
    getAllMembershipPlans,
    createMembershipPlan,
    updateMembershipPlan,
    toggleMembershipPlanActive,
    deleteMembershipPlan,
    getTrainers,
    createTrainer,
    updateTrainer,
    deleteTrainer,
    getBookings,
    updateBookingStatus,
    getPayments,
    getTrainerCheckins,
    createTrainerCheckin,
    deleteTrainerCheckin,
};
