import api from '@/lib/api';

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  aiLimit: number;
  aiDailyLimit: number;
  description: string;
  isActive: boolean;
}

export interface UserMembership {
  id: string;
  userId: string;
  planId: string;
  plan: MembershipPlan;
  startDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
  aiUsageCount: number;
  aiDailyCount: number;
}

export const membershipService = {
  // Lấy danh sách gói
  async getPlans(): Promise<MembershipPlan[]> {
    const response = await api.get('/memberships/plans');
    return response.data.data.plans.plans; // Cấu trúc đặc biệt
  },

  // Lấy membership hiện tại
  async getCurrentMembership(): Promise<UserMembership | null> {
    const response = await api.get('/memberships/current');
    return response.data.data.membership;
  },

  // Mua gói
  async buyMembership(planId: string): Promise<UserMembership> {
    const response = await api.post('/memberships/buy', { planId });
    return response.data.data.membership;
  },
};