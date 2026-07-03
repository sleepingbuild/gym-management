import api from '@/lib/api';

export interface BodyProgressRecord {
  id: string;
  userId: string;
  weight: number;
  height?: number | null;
  bodyFat?: number | null;
  muscleMass?: number | null;
  bmi?: number | null;
  notes?: string | null;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProgressDTO {
  weight: number;
  height?: number;
  bodyFat?: number;
  muscleMass?: number;
  notes?: string;
  recordedAt?: string;
}

export interface ProgressStats {
  totalRecords: number;
  firstRecord: {
    weight: number;
    bmi: number | null;
    bodyFat: number | null;
    recordedAt: string;
  };
  latestRecord: {
    weight: number;
    bmi: number | null;
    bodyFat: number | null;
    recordedAt: string;
  };
  progress: {
    weight: number;
    bmi: number | null;
    bodyFat: number | null;
  };
  average: {
    weight: number;
    bmi: number | null;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    weight: number[];
    bmi: number[];
    bodyFat: number[];
    muscleMass: number[];
  };
}

export const bodyProgressService = {
  // Create new progress record
  async create(data: CreateProgressDTO): Promise<BodyProgressRecord> {
    const response = await api.post('/body-progress', data);
    return response.data.data;
  },

  // Get all records
  async getAll(limit?: number): Promise<BodyProgressRecord[]> {
    const response = await api.get('/body-progress', {
      params: { limit },
    });
    return response.data.data.records;
  },

  // Get latest record
  async getLatest(): Promise<BodyProgressRecord | null> {
    const response = await api.get('/body-progress/latest');
    return response.data.data;
  },

  // Get chart data
  async getChartData(days: number = 30): Promise<ChartData> {
    const response = await api.get('/body-progress/chart', {
      params: { days },
    });
    return response.data.data;
  },

  // Get stats
  async getStats(): Promise<ProgressStats | null> {
    const response = await api.get('/body-progress/stats');
    return response.data.data;
  },

  // Update record
  async update(id: string, data: Partial<CreateProgressDTO>): Promise<BodyProgressRecord> {
    const response = await api.put(`/body-progress/${id}`, data);
    return response.data.data;
  },

  // Delete record
  async delete(id: string): Promise<void> {
    await api.delete(`/body-progress/${id}`);
  },
};