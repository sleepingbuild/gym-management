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
            <CartesianGrid strokeDasharray="3 3" stroke="#e6dfd8" />
            <XAxis
              dataKey="date"
              stroke="#6c6a64"
              fontSize={12}
              tickFormatter={(value) => {
                const d = new Date(value);
                return `${d.getDate()}/${d.getMonth() + 1}`;
              }}
            />
            <YAxis stroke="#6c6a64" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#faf9f5",
                border: "1px solid #e6dfd8",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#cc785c"
              name="Cân nặng (kg)"
              strokeWidth={2}
              dot={{ fill: "#cc785c" }}
            />
            <Line
              type="monotone"
              dataKey="bmi"
              stroke="#5db8a6"
              name="BMI"
              strokeWidth={2}
              dot={{ fill: "#5db8a6" }}
            />
            <Line
              type="monotone"
              dataKey="bodyFat"
              stroke="#e8a55a"
              name="Mỡ cơ thể (%)"
              strokeWidth={2}
              dot={{ fill: "#e8a55a" }}
            />
            <Line
              type="monotone"
              dataKey="muscleMass"
              stroke="#5db872"
              name="Cơ (kg)"
              strokeWidth={2}
              dot={{ fill: "#5db872" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
