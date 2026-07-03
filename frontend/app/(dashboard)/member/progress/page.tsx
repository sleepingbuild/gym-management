'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { bodyProgressService } from '@/services/bodyProgress.service';
import { ProgressStats } from './components/ProgressStats';
import { ProgressChart } from './components/ProgressChart';
import { ProgressForm } from './components/ProgressForm';
import { ProgressHistory } from './components/ProgressHistory';
import { CreateProgressDTO } from '@/services/bodyProgress.service';

export default function ProgressPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [records, setRecords] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, chartRes, recordsRes] = await Promise.all([
        bodyProgressService.getStats(),
        bodyProgressService.getChartData(30),
        bodyProgressService.getAll(),
      ]);
      setStats(statsRes);
      setChartData(chartRes);
      setRecords(recordsRes);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (data: CreateProgressDTO) => {
    setSubmitting(true);
    try {
      await bodyProgressService.create(data);
      await fetchData();
    } catch (error) {
      console.error('Error creating progress record:', error);
      alert('Không thể tạo record. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa record này?')) return;
    try {
      await bodyProgressService.delete(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Không thể xóa record. Vui lòng thử lại.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-display-md font-display text-ink">
          Theo dõi tiến trình
        </h1>
        <p className="text-body text-muted mt-1">
          Theo dõi cân nặng, BMI và các chỉ số cơ thể của bạn
        </p>
      </div>

      {/* Stats */}
      <ProgressStats stats={stats} loading={loading} />

      {/* Chart */}
      <ProgressChart data={chartData} loading={loading} />

      {/* Form + History */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <ProgressForm onSubmit={handleCreate} loading={submitting} />
        </div>
        <div className="lg:col-span-3">
          <ProgressHistory records={records} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}