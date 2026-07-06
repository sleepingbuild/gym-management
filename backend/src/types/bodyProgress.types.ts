export interface BodyProgressRecord {
    id: string;
    userId: string;
    weight: number;
    height?: number | null;
    bodyFat?: number | null;
    muscleMass?: number | null;
    bmi?: number | null;
    notes?: string | null;
    recordedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateBodyProgressDTO {
    weight: number;
    height?: number;
    bodyFat?: number;
    muscleMass?: number;
    notes?: string;
    recordedAt?: Date;
}

export interface UpdateBodyProgressDTO {
    weight?: number;
    height?: number;
    bodyFat?: number;
    muscleMass?: number;
    notes?: string;
    recordedAt?: Date;
}

export interface BodyProgressChartData {
    labels: string[];
    datasets: {
        weight: number[];
        bmi: number[];
        bodyFat: number[];
        muscleMass: number[];
    };
}
