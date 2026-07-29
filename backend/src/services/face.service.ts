import { prisma } from "../config/prisma";
import { AppError } from "../utils/errors";
import { EnrollFaceDTO, FaceProfileForKiosk, EnrollableUser } from "../types/face.types";

function averageDescriptors(descriptors: number[][]): number[] {
    const length = descriptors[0].length;
    const sum = new Array(length).fill(0);

    for (const d of descriptors) {
        for (let i = 0; i < length; i++) {
            sum[i] += d[i];
        }
    }

    return sum.map((v) => v / descriptors.length);
}

export const faceService = {
    // Admin đăng ký hộ (hoặc user tự đăng ký sau này) — upsert, 1 user chỉ có 1 profile
    async enroll(dto: EnrollFaceDTO) {
        const user = await prisma.user.findUnique({ where: { id: dto.userId } });
        if (!user) {
            throw new AppError(404, "User not found", "FACE_001");
        }

        const descriptor = averageDescriptors(dto.descriptors);

        const profile = await prisma.faceProfile.upsert({
            where: { userId: dto.userId },
            update: { descriptor },
            create: { userId: dto.userId, descriptor },
        });

        return { userId: profile.userId, updatedAt: profile.updatedAt };
    },

    // Toàn bộ descriptor cho Kiosk (chỉ Admin gọi được — xem role.middleware ở route)
    async getAllForKiosk(): Promise<FaceProfileForKiosk[]> {
        const profiles = await prisma.faceProfile.findMany({
            include: { user: { select: { id: true, fullName: true, role: true, isActive: true } } },
        });

        return profiles
            .filter((p) => p.user.isActive)
            .map((p) => ({
                userId: p.user.id,
                fullName: p.user.fullName,
                role: p.user.role,
                descriptor: p.descriptor,
            }));
    },

    // Descriptor của chính người đang đăng nhập — dùng cho Self Check-in
    async getMyProfile(userId: string): Promise<FaceProfileForKiosk | null> {
        const profile = await prisma.faceProfile.findUnique({
            where: { userId },
            include: { user: { select: { id: true, fullName: true, role: true } } },
        });

        if (!profile) return null;

        return {
            userId: profile.user.id,
            fullName: profile.user.fullName,
            role: profile.user.role,
            descriptor: profile.descriptor,
        };
    },

    // Danh sách người có thể đăng ký khuôn mặt (cho trang AdminRegister)
    async getEnrollableUsers(): Promise<EnrollableUser[]> {
        const users = await prisma.user.findMany({
            where: { isActive: true, isDeleted: false },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                faceProfile: { select: { id: true } },
            },
            orderBy: { fullName: "asc" },
        });

        return users.map((u) => ({
            id: u.id,
            fullName: u.fullName,
            email: u.email,
            role: u.role,
            hasProfile: !!u.faceProfile,
        }));
    },

    async deleteProfile(userId: string) {
        const existing = await prisma.faceProfile.findUnique({ where: { userId } });
        if (!existing) {
            throw new AppError(404, "Face profile not found", "FACE_002");
        }
        await prisma.faceProfile.delete({ where: { userId } });
    },
};
