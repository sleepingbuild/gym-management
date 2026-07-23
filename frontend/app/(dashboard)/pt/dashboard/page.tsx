"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import api from "@/lib/api";

interface PTStudent {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  membership: string;
  lastBookingDate: string | null;
}

interface PTStats {
  totalStudents: number;
  todayBookings: number;
  pendingBookings: number;
}

export default function PTDashboardPage() {
  const [students, setStudents] = useState<PTStudent[]>([]);
  const [stats, setStats] = useState<PTStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, statsRes] = await Promise.all([
          api.get("/pt/students"),
          api.get("/pt/stats"),
        ]);
        setStudents(studentsRes.data.data.students);
        setStats(statsRes.data.data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (date: string | null) => {
    if (!date) return "Chưa có lịch";
    const d = new Date(date);
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-display-md font-display text-ink">PT Dashboard</h1>
        <p className="text-body text-muted mt-1">
          Quản lý học viên và theo dõi tiến trình
        </p>
      </div>

      {error && (
        <div className="bg-error/10 text-error border border-error/30 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-caption uppercase text-muted">Tổng học viên</p>
          <p className="text-display-sm font-display text-ink">
            {loading ? "..." : (stats?.totalStudents ?? 0)}
          </p>
        </Card>
        <Card>
          <p className="text-caption uppercase text-muted">Lịch hẹn hôm nay</p>
          <p className="text-display-sm font-display text-ink">
            {loading ? "..." : (stats?.todayBookings ?? 0)}
          </p>
        </Card>
        <Card>
          <p className="text-caption uppercase text-muted">Chờ xác nhận</p>
          <p className="text-display-sm font-display text-ink">
            {loading ? "..." : (stats?.pendingBookings ?? 0)}
          </p>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <h3 className="text-title-md font-display text-ink mb-4">
          Danh sách học viên
        </h3>
        {loading ? (
          <p className="text-body text-muted text-center py-4">Đang tải...</p>
        ) : students.length === 0 ? (
          <p className="text-body text-muted text-center py-4">
            Chưa có học viên nào
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-body-sm">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="text-left py-2 text-muted font-medium">
                    Họ tên
                  </th>
                  <th className="text-left py-2 text-muted font-medium">
                    Email
                  </th>
                  <th className="text-left py-2 text-muted font-medium">Gói</th>
                  <th className="text-left py-2 text-muted font-medium">
                    Lịch hẹn gần nhất
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-hairline/50">
                    <td className="py-2 font-medium">{student.fullName}</td>
                    <td className="py-2">{student.email}</td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          student.membership === "Premium"
                            ? "bg-primary/10 text-primary"
                            : "bg-surface-dark-elevated text-muted"
                        }`}
                      >
                        {student.membership}
                      </span>
                    </td>
                    <td className="py-2">
                      {formatDate(student.lastBookingDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}