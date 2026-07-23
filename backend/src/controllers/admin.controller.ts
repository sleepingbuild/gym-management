import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/errors";
import { Role } from "@prisma/client";

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
        const start = new Date(now.getFullYear(), now.getMonth() - (MONTHS_BACK - 1), 1);

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

        const revenue = Array.from(monthMap.entries()).map(([month, total]) => ({
            month,
            revenue: total,
        }));

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
 * Lấy TẤT CẢ gói tập (kể cả đã khóa) để admin quản lý.
 * Khác với GET /memberships/plans (public) chỉ trả gói đang active.
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
        const { name, price, duration, aiLimit, aiDailyLimit, description } = req.body;

        if (!name || typeof name !== "string")
            throw new AppError(400, "PLAN_001: Tên gói không hợp lệ");
        if (typeof price !== "number" || price < 0)
            throw new AppError(400, "PLAN_002: Giá gói không hợp lệ");
        if (!Number.isInteger(duration) || duration <= 0)
            throw new AppError(400, "PLAN_003: Thời hạn (ngày) không hợp lệ");
        if (!Number.isInteger(aiLimit) || (aiLimit < 0 && aiLimit !== -1))
            throw new AppError(400, "PLAN_004: Giới hạn AI/tháng không hợp lệ");
        if (!Number.isInteger(aiDailyLimit) || (aiDailyLimit < 0 && aiDailyLimit !== -1))
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
        const { name, price, duration, aiLimit, aiDailyLimit, description } = req.body;

        const existing = await prisma.membershipPlan.findUnique({ where: { id } });
        if (!existing) throw new AppError(404, "PLAN_006: Gói tập không tồn tại");

        if (price !== undefined && (typeof price !== "number" || price < 0))
            throw new AppError(400, "PLAN_002: Giá gói không hợp lệ");
        if (duration !== undefined && (!Number.isInteger(duration) || duration <= 0))
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
        const existing = await prisma.membershipPlan.findUnique({ where: { id } });
        if (!existing) throw new AppError(404, "PLAN_006: Gói tập không tồn tại");

        const plan = await prisma.membershipPlan.update({
            where: { id },
            data: { isActive: !existing.isActive },
        });

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: plan.isActive ? "Membership plan unlocked" : "Membership plan locked",
            data: { plan },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /admin/memberships/:id
 * Chặn xóa nếu đang có UserMembership tham chiếu tới gói này.
 */
const deleteMembershipPlan = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const id = req.params.id as string;
        const existing = await prisma.membershipPlan.findUnique({ where: { id } });
        if (!existing) throw new AppError(404, "PLAN_006: Gói tập không tồn tại");

        const inUseCount = await prisma.userMembership.count({ where: { planId: id } });
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
};