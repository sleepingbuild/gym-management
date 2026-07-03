import { prisma } from "../config/prisma";
import { AppError } from "../utils/errors";

export const membershipService = {
    // ✅ Optimized: use select instead of include
    async getCurrentMembership(userId: string) {
        const membership = await prisma.userMembership.findFirst({
            where: { userId, status: 'ACTIVE' },
            select: {
                id: true,
                userId: true,
                planId: true,
                startDate: true,
                expiryDate: true,
                aiUsageCount: true,
                aiDailyCount: true,
                status: true,
                plan: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        aiLimit: true,
                        aiDailyLimit: true,
                        description: true,
                    }
                }
            }
        });
        return membership;
    },

    // ✅ Optimized: with pagination
    async getAllPlans(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [plans, total] = await Promise.all([
            prisma.membershipPlan.findMany({
                where: { isActive: true },
                orderBy: { price: 'asc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    price: true,
                    aiLimit: true,
                    aiDailyLimit: true,
                    description: true,
                    isActive: true,
                }
            }),
            prisma.membershipPlan.count({ where: { isActive: true } })
        ]);
        return { plans, total, page, limit, totalPages: Math.ceil(total / limit) };
    },

    // ✅ Optimized: batch create
    async buyMembership(userId: string, planId: string) {
        const plan = await prisma.membershipPlan.findFirst({
            where: { id: planId, isActive: true },
            select: { id: true, duration: true }
        });
        if (!plan) {
            throw new AppError(404, "MEMBERSHIP_002: Plan not found or inactive");
        }

        const existing = await prisma.userMembership.findFirst({
            where: { userId, status: "ACTIVE" },
            select: { id: true }
        });
        if (existing) {
            throw new AppError(400, "MEMBERSHIP_003: User already has an active membership");
        }

        const startDate = new Date();
        const expiryDate = new Date(startDate);
        expiryDate.setDate(expiryDate.getDate() + plan.duration);

        const membership = await prisma.userMembership.create({
            data: {
                userId,
                planId,
                startDate,
                expiryDate,
                status: "ACTIVE",
                aiUsageCount: 0,
                aiDailyCount: 0,
                aiUsageReset: startDate,
                aiDailyReset: startDate,
            },
            select: {
                id: true,
                userId: true,
                planId: true,
                startDate: true,
                expiryDate: true,
                status: true,
                plan: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        aiLimit: true,
                        aiDailyLimit: true,
                    }
                }
            }
        });

        return membership;
    },
};