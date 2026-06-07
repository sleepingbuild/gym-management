export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'PT' | 'MEMBER';
  avatar?: string;
  phone?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  aiLimit: number;
  aiDailyLimit: number;
  description: string | null;
}

export interface UserMembership {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  expiryDate: string;
  aiUsageCount: number;
  aiDailyCount: number;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
  plan: MembershipPlan;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}