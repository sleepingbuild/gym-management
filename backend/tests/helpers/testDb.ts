import { prisma } from '../../src/config/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

export const TestHelpers = {
  async createTestUser(overrides = {}) {
    const defaultUser = {
      email: 'test@example.com',
      password: await bcrypt.hash('Test123456', 12),
      fullName: 'Test User',
      role: 'MEMBER' as Role,
      isActive: true,
    };

    return prisma.user.create({
      data: { ...defaultUser, ...overrides },
    });
  },

  async createTestAdmin(overrides = {}) {
    const defaultAdmin = {
      email: 'admin@test.com',
      password: await bcrypt.hash('Admin123456', 12),
      fullName: 'Admin User',
      role: 'ADMIN' as Role,
      isActive: true,
    };

    return prisma.user.create({
      data: { ...defaultAdmin, ...overrides },
    });
  },

  async createTestPlan(overrides = {}) {
    const defaultPlan = {
      name: 'Premium',
      price: 9.99,
      duration: 30,
      aiLimit: 100,
      aiDailyLimit: 10,
      description: 'Test plan',
      isActive: true,
    };

    return prisma.membershipPlan.create({
      data: { ...defaultPlan, ...overrides },
    });
  },

  async createTestMembership(userId: string, planId: string, overrides = {}) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    return prisma.userMembership.create({
      data: {
        userId,
        planId,
        expiryDate,
        status: 'ACTIVE',
        ...overrides,
      },
    });
  },

  async getAuthHeaders(user: any) {
    const { generateTokens } = await import('../../src/utils/generateToken');
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      Authorization: `Bearer ${tokens.accessToken}`,
      'Content-Type': 'application/json',
    };
  },
};