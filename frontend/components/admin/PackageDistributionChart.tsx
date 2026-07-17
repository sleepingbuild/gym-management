"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DistributionItem {
  name: string;
  value: number;
}

const COLORS = ["#FF6B00", "#FF8C38", "#7c3aed", "#22c55e", "#eab308"];

export function PackageDistributionChart() {
  const [data, setData] = useState<DistributionItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistribution = async () => {
      try {
        // Backend cần expose endpoint này: GET /admin/memberships/distribution
        // Trả về: { data: { distribution: [{ name: "Premium", value: 12 }, ...] } }
        const res = await api.get("/admin/memberships/distribution");
        setData(res.data.data.distribution ?? []);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDistribution();
  }, []);

  return (
    <Card>
      <h3 className="text-title-md font-display text-ink mb-4">
        Phân bố gói tập
      </h3>

      {loading ? (
        <div className="h-72 animate-pulse">
          <div className="h-full bg-hairline rounded" />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="h-72 flex items-center justify-center">
          <p className="text-body text-muted text-center">
            Chưa có dữ liệu phân bố gói.
            <br />
            <span className="text-caption text-muted-soft">
              (Cần API GET /admin/memberships/distribution)
            </span>
          </p>
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1d27",
                  border: "1px solid #2a2d3a",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                }}
                itemStyle={{ color: "#e2e8f0" }}
              />
              <Legend wrapperStyle={{ color: "#a8afbd", fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}