"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card } from "@/components/ui/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenuePoint {
  month: string;
  revenue: number;
}

export function RevenueChart() {
  const [data, setData] = useState<RevenuePoint[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        // Backend cần expose endpoint này: GET /admin/revenue
        // Trả về: { data: { revenue: [{ month: "2026-01", revenue: 1200000 }, ...] } }
        const res = await api.get("/admin/revenue");
        setData(res.data.data.revenue ?? []);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  return (
    <Card>
      <h3 className="text-title-md font-display text-ink mb-4">
        Doanh thu theo tháng
      </h3>

      {loading ? (
        <div className="h-72 animate-pulse">
          <div className="h-full bg-hairline rounded" />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="h-72 flex items-center justify-center">
          <p className="text-body text-muted text-center">
            Chưa có dữ liệu doanh thu.
            <br />
            <span className="text-caption text-muted-soft">
              (Cần API GET /admin/revenue)
            </span>
          </p>
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
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
                formatter={(value) => [
                  `${Number(value).toLocaleString("vi-VN")} VND`,
                  "Doanh thu",
                ]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#FF6B00"
                strokeWidth={2}
                dot={{ fill: "#FF6B00" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}