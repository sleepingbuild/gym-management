import api from '@/lib/api';

export interface AttendanceRecord {
    id: string;
    userId: string;
    checkInTime: string;
    checkOutTime: string | null;
    qrCode: string;
    qrExpiry: string;
    notes: string | null;
}

export interface QRResponse {
    attendanceId: string;
    qrCode: string;
    qrExpiry: string;
}

export interface AttendanceStats {
    total: number;
    thisMonth: number;
    today: number;
}

export const attendanceService = {
    // Generate QR code
    async generateQR(duration: number = 5): Promise<QRResponse> {
        const response = await api.get('/attendance/qr', {
            params: { duration },
        });
        return response.data.data;
    },

    // Check-in with QR code
    async checkIn(qrCode: string): Promise<AttendanceRecord> {
        const response = await api.post('/attendance/check-in', { qrCode });
        return response.data.data;
    },

    // Check-out
    async checkOut(attendanceId: string, notes?: string): Promise<AttendanceRecord> {
        const response = await api.post('/attendance/check-out', { attendanceId, notes });
        return response.data.data;
    },

    // Get history
    async getHistory(limit?: number): Promise<AttendanceRecord[]> {
        const response = await api.get('/attendance/history', {
            params: { limit },
        });
        return response.data.data.records;
    },

    // Get stats
    async getStats(): Promise<AttendanceStats> {
        const response = await api.get('/attendance/stats');
        return response.data.data;
    },
};