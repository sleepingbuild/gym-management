export const PLAN_IDS = {
  BASIC: 'plan_basic',
  PREMIUM: 'plan_premium',
  ELITE: 'plan_elite',
} as const;

export const AI_LIMITS = {
  BASIC: { monthly: 30, daily: 3 },
  PREMIUM: { monthly: 300, daily: 30 },
  ELITE: { monthly: -1, daily: -1 }, // -1 = Unlimited
} as const;

export const MEMBERSHIP_STATUS = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  SUSPENDED: 'SUSPENDED',
} as const;

// Helper: kiểm tra có phải unlimited không
export const isUnlimited = (limit: number): boolean => limit === -1;