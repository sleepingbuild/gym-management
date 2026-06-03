import { prisma } from '../config/prisma';
import { MembershipPlan } from '../types/membership.types';

const getAllPlans = async (): Promise<MembershipPlan[]> => {
  const plans = await prisma.membershipPlan.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  });
  return plans;
};

export const membershipService = {
  getAllPlans,
};
