import api from '@/lib/api';

export interface Trainer {
  id: string;
  specialties: string;
  bio: string | null;
  status: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface Booking {
  id: string;
  memberId: string;
  trainerId: string;
  date: string;
  timeSlot: string;
  notes: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  trainer: {
    id: string;
    fullName: string;
  };
}

export const bookingService = {
  async getAvailableTrainers(): Promise<Trainer[]> {
    const response = await api.get('/bookings/trainers');
    return response.data.data.trainers;
  },

  async createBooking(data: {
    trainerId: string;
    date: string;
    timeSlot: string;
    notes?: string;
  }): Promise<Booking> {
    const response = await api.post('/bookings', data);
    return response.data.data.booking;
  },

  async getMyBookings(): Promise<Booking[]> {
    const response = await api.get('/bookings/my');
    return response.data.data.bookings;
  },

  async cancelBooking(id: string): Promise<Booking> {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data.data.booking;
  },
};