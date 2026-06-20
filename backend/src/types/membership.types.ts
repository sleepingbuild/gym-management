import { MembershipStatus } from "@prisma/client";

export interface MembershipPlan {
    id: string;
    name: string;
    price: number;
    duration: number;
    aiLimit: number;
    aiDailyLimit: number;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserMembership {
    id: string;
    userId: string;
    planId: string;
    startDate: Date;
    expiryDate: Date;
    aiUsageCount: number;
    aiDailyCount: number;
    aiUsageReset: Date;
    aiDailyReset: Date;
    status: MembershipStatus;
    createdAt: Date;
    updatedAt: Date;
    plan?: MembershipPlan;
}

export interface UserMembershipWithPlan extends UserMembership {
    plan: MembershipPlan;
}
