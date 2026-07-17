"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { UsersIcon, UserGroupIcon, BoltIcon } from "@heroicons/react/24/outline";

interface Stats {
  totalUsers: number;
  totalMembers: number;
  activeMembers: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data.data);
      } catch {
        // API chua co, dung placeholder
        setStats({ totalUsers: 0, totalMembers: 0, activeMembers: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
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
      label: "Tổng người dùng",
      value: stats?.totalUsers ?? 0,
      icon: UsersIcon,
      tone: "text-primary bg-primary/10",
    },
    {
      label: "Thành viên",
      value: stats?.totalMembers ?? 0,
      icon: UserGroupIcon,
      tone: "text-accent-teal bg-accent-teal/10",
    },
    {
      label: "Đang hoạt động",
      value: stats?.activeMembers ?? 0,
      icon: BoltIcon,
      tone: "text-success bg-success/10",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-display-md text-ink">
          Admin Dashboard
        </h1>
        <p className="text-muted text-body-sm mt-1 capitalize">
          {new Date().toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-surface-card border border-hairline rounded-lg p-6 transition-all duration-150 hover:border-primary hover:-translate-y-0.5"
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

      {/* Quick Links */}
      <div>
        <h2 className="font-display text-title-lg text-ink mb-4">Quản lý</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/users"
            className="group bg-surface-card border border-hairline rounded-lg p-5 block no-underline transition-all duration-150 hover:border-primary hover:-translate-y-0.5"
          >
            <p className="text-ink text-title-sm mb-1 group-hover:text-primary transition-colors">
              👥 Người dùng
            </p>
            <p className="text-muted text-body-sm">
              Quản lý tài khoản thành viên
            </p>
          </a>
          <a
            href="/admin/memberships"
            className="group bg-surface-card border border-hairline rounded-lg p-5 block no-underline transition-all duration-150 hover:border-primary hover:-translate-y-0.5"
          >
            <p className="text-ink text-title-sm mb-1 group-hover:text-primary transition-colors">
              💳 Gói thành viên
            </p>
            <p className="text-muted text-body-sm">
              Xem các gói đang hoạt động
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}