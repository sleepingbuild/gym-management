import api from '@/lib/api';

export interface BodyGoal {
    id: string;
    userId: string;
    targetWeight: number | null;
    targetBmi: number | null;
    targetBodyFat: number | null;
    targetMuscle: number | null;
    startDate: string;
    targetDate: string;
    status: 'ACTIVE' | 'ACHIEVED' | 'EXPIRED';
    notes: string | null;
}

export interface CreateGoalDTO {
    targetWeight?: number;
    targetBmi?: number;
    targetBodyFat?: number;
    targetMuscle?: number;
    targetDate: string;
    notes?: string;
}

export interface UpdateGoalDTO {
    targetWeight?: number;
    targetBmi?: number;
    targetBodyFat?: number;
    targetMuscle?: number;
    targetDate?: string;
    status?: 'ACTIVE' | 'ACHIEVED' | 'EXPIRED';
    notes?: string;
}

export interface AchievementResult {
    achieved: boolean;
    message: string;
}

export const bodyGoalService = {
    // Create goal
    async create(data: CreateGoalDTO): Promise<BodyGoal> {
        const response = await api.post('/body-goal', data);
        return response.data.data;
    },

    // Get current goal
    async getCurrent(): Promise<BodyGoal | null> {
        const response = await api.get('/body-goal/current');
        return response.data.data;
    },

    // Update goal
    async update(data: UpdateGoalDTO): Promise<BodyGoal> {
        const response = await api.put('/body-goal', data);
        return response.data.data;
    },

    // Check achievement
    async checkAchievement(): Promise<AchievementResult> {
        const response = await api.get('/body-goal/check-achievement');
        return response.data.data;
    },

    // Delete goal
    async deleteGoal(): Promise<void> {
        await api.delete('/body-goal');
    },

    // Thêm method mới
    async createOrUpdate(data: CreateGoalDTO): Promise<BodyGoal> {
        try {
            // Thử tạo mới
            return await this.create(data);
        } catch (error: any) {
            // Nếu lỗi là đã tồn tại, update
            if (error.response?.data?.errorCode === 'GOAL_001') {
                const updateData: UpdateGoalDTO = {
                    targetWeight: data.targetWeight,
                    targetBmi: data.targetBmi,
                    targetBodyFat: data.targetBodyFat,
                    targetMuscle: data.targetMuscle,
                    targetDate: data.targetDate,
                    notes: data.notes,
                };
                return await this.update(updateData);
            }
            throw error;
        }
    }
};