import api from "@/lib/api";

export interface EnrollableUser {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "MEMBER" | "PT";
  hasProfile: boolean;
}

export interface FaceProfileForKiosk {
  userId: string;
  fullName: string;
  role: "ADMIN" | "MEMBER" | "PT";
  descriptor: number[];
}

export interface FaceCheckInResult {
  matchedRole: "MEMBER" | "PT";
  message: string;
  booking?: { id: string; checkInTime: string };
  trainerCheckIn?: { id: string; checkedInAt: string };
}

export const faceService = {
  async getEnrollableUsers(): Promise<EnrollableUser[]> {
    const res = await api.get("/face/enrollable-users");
    return res.data.data.users;
  },

  async enroll(userId: string, descriptors: number[][]) {
    const res = await api.post("/face/enroll", { userId, descriptors });
    return res.data.data;
  },

  async getProfilesForKiosk(): Promise<FaceProfileForKiosk[]> {
    const res = await api.get("/face/profiles");
    return res.data.data.profiles;
  },

  async getMyProfile(): Promise<FaceProfileForKiosk | null> {
    const res = await api.get("/face/me");
    return res.data.data.profile;
  },

  async deleteProfile(userId: string) {
    await api.delete(`/face/${userId}`);
  },
};

export const faceAttendanceService = {
  // Kiosk (Admin) — đã match ở client, gửi userId lên để server ghi nhận
  async checkIn(userId: string): Promise<FaceCheckInResult> {
    const res = await api.post("/face-attendance/checkin", { userId });
    return res.data.data;
  },

  // Self check-in (Trainer/Member) — không gửi userId, server tự lấy từ token
  async selfCheckIn(): Promise<FaceCheckInResult> {
    const res = await api.post("/face-attendance/checkin/self");
    return res.data.data;
  },
};
