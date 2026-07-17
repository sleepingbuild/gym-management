"use client";

import { Card } from "@/components/ui/Card";
import { ChartData } from "@/services/bodyProgress.service";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ProgressChartProps {
  data: ChartData | null;
  loading?: boolean;
}

export function ProgressChart({ data, loading }: ProgressChartProps) {
  if (loading) {
    return (
      <Card className="h-80 animate-pulse">
        <div className="h-full bg-hairline rounded" />
      </Card>
    );
  }

  if (!data || data.labels.length === 0) {
    return (
      <Card className="h-80 flex items-center justify-center">
        <p className="text-body text-muted">
          Chưa có dữ liệu để hiển thị biểu đồ
        </p>
      </Card>
    );
  }

  const chartData = data.labels.map((label, index) => ({
    date: label,
    weight: data.datasets.weight[index] || 0,
    bmi: data.datasets.bmi[index] || 0,
    bodyFat: data.datasets.bodyFat[index] || 0,
    muscleMass: data.datasets.muscleMass[index] || 0,
  }));

  return (
    <Card>
      <h3 className="text-title-md font-display text-ink mb-4">
        Biểu đồ theo dõi
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => {
                const d = new Date(value);
                return `${d.getDate()}/${d.getMonth() + 1}`;
              }}
            />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1d27",
                border: "1px solid #2a2d3a",
                borderRadius: "8px",
                color: "#e2e8f0",
              }}
              labelStyle={{ color: "#e2e8f0" }}
              itemStyle={{ color: "#e2e8f0" }}
            />
            <Legend wrapperStyle={{ color: "#a8afbd" }} />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#FF6B00"
              name="Cân nặng (kg)"
              strokeWidth={2}
              dot={{ fill: "#FF6B00" }}
            />
            <Line
              type="monotone"
              dataKey="bmi"
              stroke="#7c3aed"
              name="BMI"
              strokeWidth={2}
              dot={{ fill: "#7c3aed" }}
            />
            <Line
              type="monotone"
              dataKey="bodyFat"
              stroke="#FF8C38"
              name="Mỡ cơ thể (%)"
              strokeWidth={2}
              dot={{ fill: "#FF8C38" }}
            />
            <Line
              type="monotone"
              dataKey="muscleMass"
              stroke="#22c55e"
              name="Cơ (kg)"
              strokeWidth={2}
              dot={{ fill: "#22c55e" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}