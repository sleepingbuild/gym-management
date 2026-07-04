export interface CreateBodyGoalDTO {
  targetWeight?: number;
  targetBmi?: number;
  targetBodyFat?: number;
  targetMuscle?: number;
  targetDate: Date;
  notes?: string;
}

export interface UpdateBodyGoalDTO {
  targetWeight?: number;
  targetBmi?: number;
  targetBodyFat?: number;
  targetMuscle?: number;
  targetDate?: Date;
  status?: string;
  notes?: string;
}

export interface BodyGoalResponse {
  id: string;
  userId: string;
  targetWeight: number | null;
  targetBmi: number | null;
  targetBodyFat: number | null;
  targetMuscle: number | null;
  startDate: Date;
  targetDate: Date;
  status: string;
  notes: string | null;
}
