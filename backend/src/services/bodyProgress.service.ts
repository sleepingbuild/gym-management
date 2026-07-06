import { prisma } from "../config/prisma";
import { AppError } from "../utils/errors";
import {
    CreateBodyProgressDTO,
    UpdateBodyProgressDTO,
} from "../types/bodyProgress.types";

export const bodyProgressService = {
    // Create new progress record
    async create(userId: string, dto: CreateBodyProgressDTO) {
        // Calculate BMI if height and weight provided
        let bmi: number | undefined;
        if (dto.height && dto.weight) {
            bmi = dto.weight / (dto.height / 100) ** 2;
            bmi = Math.round(bmi * 10) / 10;
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new AppError(404, "User not found", "USER_001");
        }

        // Check if user has active membership
        const membership = await prisma.userMembership.findUnique({
            where: { userId },
        });
        if (!membership || membership.status !== "ACTIVE") {
            throw new AppError(
                403,
                "Active membership required to track progress",
                "MEMBERSHIP_005",
            );
        }

        const record = await prisma.bodyProgress.create({
            data: {
                userId,
                weight: dto.weight,
                height: dto.height,
                bodyFat: dto.bodyFat,
                muscleMass: dto.muscleMass,
                bmi,
                notes: dto.notes,
                recordedAt: dto.recordedAt || new Date(),
            },
        });

        return record;
    },

    // Get all progress records for user
    async getAll(userId: string, limit?: number) {
        const records = await prisma.bodyProgress.findMany({
            where: { userId },
            orderBy: { recordedAt: "desc" },
            take: limit || 50,
        });
        return records;
    },

    // Get latest progress record
    async getLatest(userId: string) {
        const record = await prisma.bodyProgress.findFirst({
            where: { userId },
            orderBy: { recordedAt: "desc" },
        });
        return record;
    },

    // Get progress for chart (last 30 days)
    async getChartData(userId: string, days: number = 30) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);

        const records = await prisma.bodyProgress.findMany({
            where: {
                userId,
                recordedAt: { gte: cutoff },
            },
            orderBy: { recordedAt: "asc" },
        });

        return {
            labels: records.map(
                (r) => r.recordedAt.toISOString().split("T")[0],
            ),
            datasets: {
                weight: records.map((r) => r.weight),
                bmi: records.map((r) => r.bmi || 0),
                bodyFat: records.map((r) => r.bodyFat || 0),
                muscleMass: records.map((r) => r.muscleMass || 0),
            },
        };
    },

    // Update progress record
    async update(id: string, userId: string, dto: UpdateBodyProgressDTO) {
        // Check if record exists and belongs to user
        const existing = await prisma.bodyProgress.findFirst({
            where: { id, userId },
        });
        if (!existing) {
            throw new AppError(
                404,
                "Progress record not found",
                "PROGRESS_001",
            );
        }

        // Calculate BMI if height and weight provided
        let bmi: number | undefined;
        const weight = dto.weight ?? existing.weight;
        const height = dto.height ?? existing.height;
        if (height && weight) {
            bmi = weight / (height / 100) ** 2;
            bmi = Math.round(bmi * 10) / 10;
        }

        const updated = await prisma.bodyProgress.update({
            where: { id },
            data: {
                weight: dto.weight,
                height: dto.height,
                bodyFat: dto.bodyFat,
                muscleMass: dto.muscleMass,
                bmi,
                notes: dto.notes,
                recordedAt: dto.recordedAt,
            },
        });

        return updated;
    },

    // Delete progress record
    async delete(id: string, userId: string) {
        const existing = await prisma.bodyProgress.findFirst({
            where: { id, userId },
        });
        if (!existing) {
            throw new AppError(
                404,
                "Progress record not found",
                "PROGRESS_001",
            );
        }

        await prisma.bodyProgress.delete({
            where: { id },
        });

        return { success: true };
    },

    // Get summary stats
    async getStats(userId: string) {
        const records = await prisma.bodyProgress.findMany({
            where: { userId },
            orderBy: { recordedAt: "asc" },
        });

        if (records.length === 0) {
            return null;
        }

        const first = records[0];
        const last = records[records.length - 1];

        return {
            totalRecords: records.length,
            firstRecord: {
                weight: first.weight,
                bmi: first.bmi,
                bodyFat: first.bodyFat,
                recordedAt: first.recordedAt,
            },
            latestRecord: {
                weight: last.weight,
                bmi: last.bmi,
                bodyFat: last.bodyFat,
                recordedAt: last.recordedAt,
            },
            progress: {
                weight: Math.round((last.weight - first.weight) * 10) / 10,
                bmi:
                    last.bmi && first.bmi
                        ? Math.round((last.bmi - first.bmi) * 10) / 10
                        : null,
                bodyFat:
                    last.bodyFat && first.bodyFat
                        ? Math.round((last.bodyFat - first.bodyFat) * 10) / 10
                        : null,
            },
            average: {
                weight:
                    Math.round(
                        (records.reduce((sum, r) => sum + r.weight, 0) /
                            records.length) *
                            10,
                    ) / 10,
                bmi:
                    records.filter((r) => r.bmi).length > 0
                        ? Math.round(
                              (records.reduce(
                                  (sum, r) => sum + (r.bmi || 0),
                                  0,
                              ) /
                                  records.filter((r) => r.bmi).length) *
                                  10,
                          ) / 10
                        : null,
            },
        };
    },
};
