import api from '@/lib/api';

export const paymentService = {
  async createPayment(
    planId: string,
    paymentMethod: 'VNPAY' | 'MOMO' = 'VNPAY',
  ): Promise<{ paymentUrl: string; paymentId: string }> {
    const response = await api.post('/payments/create', { planId, paymentMethod });
    return response.data.data;
  },
};