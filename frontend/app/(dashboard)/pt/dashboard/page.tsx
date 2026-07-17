"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";

interface PTStudent {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  membership: string;
  lastCheckIn: string | null;
}

export default function PTDashboardPage() {
  const [students, setStudents] = useState<PTStudent[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: Gọi API GET /pt/students khi backend có
  useEffect(() => {
    setStudents([
      {
        id: "1",
        fullName: "Nguyễn Văn A",
        email: "a@example.com",
        phone: "0123456789",
        membership: "Premium",
        lastCheckIn: "2026-07-04T10:30:00Z",
      },
      {
        id: "2",
        fullName: "Trần Thị B",
        email: "b@example.com",
        phone: "0987654321",
        membership: "Basic",
        lastCheckIn: null,
      },
    ]);
    setLoading(false);
  }, []);

  const formatDate = (date: string | null) => {
    if (!date) return "Chưa check-in";
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-caption uppercase text-muted">Tổng học viên</p>
          <p className="text-display-sm font-display text-ink">
            {students.length}
          </p>
        </Card>
        <Card>
          <p className="text-caption uppercase text-muted">Check-in hôm nay</p>
          <p className="text-display-sm font-display text-ink">0</p>
        </Card>
        <Card>
          <p className="text-caption uppercase text-muted">Premium</p>
          <p className="text-display-sm font-display text-ink">
            {students.filter((s) => s.membership === "Premium").length}
          </p>
        </Card>
        <Card>
          <p className="text-caption uppercase text-muted">Basic</p>
          <p className="text-display-sm font-display text-ink">
            {students.filter((s) => s.membership === "Basic").length}
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
                    Check-in gần nhất
                  </th>
                  <th className="text-left py-2 text-muted font-medium">
                    Thao tác
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
                    <td className="py-2">{formatDate(student.lastCheckIn)}</td>
                    <td className="py-2">
                      <button className="text-primary hover:underline text-sm">
                        Xem tiến trình
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <p className="text-body-sm text-muted text-center">
        ⚠️ PT Dashboard đang sử dụng dữ liệu mẫu. Backend API đang được phát
        triển.
      </p>
    </div>
  );
}