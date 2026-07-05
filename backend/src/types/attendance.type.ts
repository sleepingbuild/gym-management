export interface CreateAttendanceDTO {
    userId: string;
    qrCode: string;
    qrExpiry: Date;
    notes?: string;
}

export interface CheckInDTO {
    userId: string;
    qrCode?: string;
    location?: string;
}

export interface CheckOutDTO {
    attendanceId: string;
    notes?: string;
}

export interface AttendanceRecord {
    id: string;
    userId: string;
    checkInTime: Date;
    checkOutTime: Date | null;
    qrCode: string;
    qrExpiry: Date;
    notes: string | null;
}