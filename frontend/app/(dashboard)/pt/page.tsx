"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card } from "@/components/ui/Card";
import {
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";

/**
 * API mong đợi:
 * GET /pt/dashboard -> { data: {
 *   totalStudents: number,
 *   todayBookings: number,
 *   upcomingBookings: number,
 *   pendingConfirmation: number,
 *   todaySessions: [{ id, timeSlot, memberName, status }]
 * } }
 */

interface DashboardData {
  totalStudents: number;
  todayBookings: number;
  upcomingBookings: number;
  pendingConfirmation: number;
  todaySessions: {
    id: string;
    timeSlot: string;
    memberName: string;
    status: string;
  }[];
}

export default function PTDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/pt/dashboard");
        setData(res.data.data);
      } catch (err) {
        console.error(err);
        setData({
          totalStudents: 0,
          todayBookings: 0,
          upcomingBookings: 0,
          pendingConfirmation: 0,
          todaySessions: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-52">
        <p className="text-muted">Đang tải...</p>
      </div>
    );
  }

  const kpis = [
    {
      label: "Tổng học viên",
      value: data?.totalStudents ?? 0,
      icon: UserGroupIcon,
      tone: "text-primary bg-primary/10",
    },
    {
      label: "Buổi tập hôm nay",
      value: data?.todayBookings ?? 0,
      icon: CalendarIcon,
      tone: "text-accent-teal bg-accent-teal/10",
    },
    {
      label: "Buổi sắp tới",
      value: data?.upcomingBookings ?? 0,
      icon: ClockIcon,
      tone: "text-success bg-success/10",
    },
    {
      label: "Chờ xác nhận",
      value: data?.pendingConfirmation ?? 0,
      icon: BellAlertIcon,
      tone: "text-warning bg-warning/10",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-display-md text-ink">
          PT Dashboard
        </h1>
        <p className="text-muted text-body-sm mt-1">
          Quản lý học viên và theo dõi tiến trình
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-surface-card border border-hairline rounded-lg p-6 transition-all duration-150 hover:border-primary/40"
          >
            <div
              className={`w-11 h-11 rounded-md flex items-center justify-center mb-4 ${kpi.tone}`}
            >
              <kpi.icon className="w-5 h-5" />
            </div>
            <p className="text-caption-uppercase text-muted mb-1">
              {kpi.label}
            </p>
            <p className="font-display text-display-sm text-ink">
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Today sessions */}
      <Card>
        <h3 className="text-title-md font-display text-ink mb-4">
          Buổi tập hôm nay
        </h3>
        {!data?.todaySessions || data.todaySessions.length === 0 ? (
          <p className="text-muted text-center py-8">
            Hôm nay bạn không có buổi tập nào.
          </p>
        ) : (
          <div className="space-y-2">
            {data.todaySessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between bg-surface-dark-elevated rounded-md px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-ink font-medium">
                    {s.timeSlot}
                  </span>
                  <span className="text-sm text-muted">{s.memberName}</span>
                </div>
                <span className="text-xs text-muted-soft">{s.status}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}