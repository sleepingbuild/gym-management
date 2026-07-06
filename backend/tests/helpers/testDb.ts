import { prisma } from "../../src/config/prisma";
import bcrypt from "bcryptjs";
import { Role, MembershipStatus } from "@prisma/client";

export const TestHelpers = {
    async createTestUser(overrides = {}) {
        const defaultUser = {
            email: "test@example.com",
            password: await bcrypt.hash("Test123456", 12),
            fullName: "Test User",
            role: "MEMBER" as Role,
            isActive: true,
        };
        const data = { ...defaultUser, ...overrides };
        return prisma.user.upsert({
            where: { email: data.email },
            update: data,
            create: data,
        });
    },

    async createTestAdmin(overrides = {}) {
        const defaultAdmin = {
            email: "admin@test.com",
            password: await bcrypt.hash("Admin123456", 12),
            fullName: "Admin User",
            role: "ADMIN" as Role,
            isActive: true,
        };
        const data = { ...defaultAdmin, ...overrides };
        return prisma.user.upsert({
            where: { email: data.email },
            update: data,
            create: data,
        });
    },

    async createTestPlan(overrides = {}) {
        const defaultPlan = {
            name: "Premium",
            price: 9.99,
            duration: 30,
            aiLimit: 100,
            aiDailyLimit: 10,
            description: "Test plan",
            isActive: true,
        };
        const data = { ...defaultPlan, ...overrides };
        // Nếu test chạy nhiều lần có thể bị duplicate, nhưng sau mỗi test dữ liệu được xóa nên OK
        return prisma.membershipPlan.create({
            data,
        });
    },

    async createTestMembership(userId: string, planId: string, overrides = {}) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        const defaultMembership = {
            userId,
            planId,
            startDate: new Date(),
            expiryDate,
            status: MembershipStatus.ACTIVE,
            aiUsageCount: 0,
            aiDailyCount: 0,
            aiUsageReset: new Date(),
            aiDailyReset: new Date(),
        };
        const data = { ...defaultMembership, ...overrides };
        return prisma.userMembership.create({
            data,
        });
    },

    async getAuthHeaders(user: { id: string; email: string; role: Role }) {
        const { generateTokens } =
            await import("../../src/utils/generateToken");
        const tokens = generateTokens({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            Authorization: `Bearer ${tokens.accessToken}`,
            "Content-Type": "application/json",
        };
    },
};
