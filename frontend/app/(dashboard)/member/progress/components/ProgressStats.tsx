"use client";

import { Card } from "@/components/ui/Card";
import { ProgressStats as StatsType } from "@/services/bodyProgress.service";

interface ProgressStatsProps {
  stats: StatsType | null;
  loading?: boolean;
}

export function ProgressStats({ stats, loading }: ProgressStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-4 bg-hairline rounded w-1/2 mb-2" />
            <div className="h-8 bg-hairline rounded w-3/4" />
          </Card>
        ))}
      </div>
    );
  }

  if (!stats || stats.totalRecords === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-body text-muted">
          Chưa có dữ liệu theo dõi. Hãy thêm record đầu tiên!
        </p>
      </Card>
    );
  }

  const latest = stats.latestRecord;
  const weightChange = stats.progress.weight;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <p className="text-caption uppercase text-muted">Cân nặng hiện tại</p>
        <p className="text-display-sm font-display text-ink">
          {latest.weight} <span className="text-body-sm text-muted">kg</span>
        </p>
        <p
          className={`text-body-sm ${weightChange < 0 ? "text-success" : weightChange > 0 ? "text-error" : "text-muted"}`}
        >
          {weightChange > 0 ? "+" : ""}
          {weightChange} kg
        </p>
      </Card>

      <Card>
        <p className="text-caption uppercase text-muted">BMI</p>
        <p className="text-display-sm font-display text-ink">
          {latest.bmi ?? "--"}
        </p>
      </Card>

      <Card>
        <p className="text-caption uppercase text-muted">Tổng số records</p>
        <p className="text-display-sm font-display text-ink">
          {stats.totalRecords}
        </p>
      </Card>

      <Card>
        <p className="text-caption uppercase text-muted">Trung bình cân nặng</p>
        <p className="text-display-sm font-display text-ink">
          {stats.average.weight}{" "}
          <span className="text-body-sm text-muted">kg</span>
        </p>
      </Card>
    </div>
  );
}
