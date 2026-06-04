import { prisma } from '../config/prisma';
import { MembershipPlan, UserMembershipWithPlan } from '../types/membership.types';
import { AppError } from '../utils/errors';

const getAllPlans = async (): Promise<MembershipPlan[]> => {
  const plans = await prisma.membershipPlan.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  });
  return plans;
};

const buyMembership = async (
  userId: string,
  planId: string
): Promise<UserMembershipWithPlan> => {
  // 1. Kiem tra plan ton tai va isActive
  const plan = await prisma.membershipPlan.findFirst({
    where: { id: planId, isActive: true },
  });
  if (!plan) {
    throw new AppError(404, 'MEMBERSHIP_002: Plan not found or inactive');
  }

  // 2. Kiem tra user da co membership ACTIVE chua
  const existing = await prisma.userMembership.findFirst({
    where: { userId, status: 'ACTIVE' },
  });
  if (existing) {
    throw new AppError(400, 'MEMBERSHIP_003: User already has an active membership');
  }

  // 3. Tinh expiryDate
  const startDate = new Date();
  const expiryDate = new Date(startDate);
  expiryDate.setDate(expiryDate.getDate() + plan.duration);

  // 4. Tao UserMembership moi
  const membership = await prisma.userMembership.create({
    data: {
      userId,
      planId,
      startDate,
      expiryDate,
      status: 'ACTIVE',
      aiUsageCount: 0,
      aiDailyCount: 0,
      aiUsageReset: startDate,
      aiDailyReset: startDate,
    },
    include: { plan: true },
  });

  return membership;
};

const getCurrentMembership = async (
  userId: string
): Promise<UserMembershipWithPlan | null> => {
  const membership = await prisma.userMembership.findFirst({
    where: { userId, status: 'ACTIVE' },
    include: { plan: true },
  });
  return membership;
};

export const membershipService = {
  getAllPlans,
  buyMembership,
  getCurrentMembership,
};
