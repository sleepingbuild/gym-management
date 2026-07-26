"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

/**
 * API mong đợi:
 * GET /pt/clients -> { data: { clients: [{
 *   id, fullName, email,
 *   age: number | null,
 *   healthStatus: string | null,   // "Thể trạng" - null -> "Chưa cập nhật"
 *   goal: string | null,            // "Mục tiêu" - null -> "—"
 *   totalSessions: number,
 *   lastSessionDate: string | null  // ISO date
 * }] } }
 */

interface ClientRow {
  id: string;
  fullName: string;
  email: string;
  age: number | null;
  healthStatus: string | null;
  goal: string | null;
  totalSessions: number;
  lastSessionDate: string | null;
}

export default function PTClientsPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get("/pt/clients");
        setClients(res.data.data.clients);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const formatDate = (date: string | null) =>
    date
      ? new Date(date).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "—";

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-display-md text-ink">
          Khách hàng của tôi
        </h1>
        <p className="text-muted text-body-sm mt-1">
          Danh sách hội viên đã đặt lịch tập với bạn
        </p>
      </div>

      {/* Table */}
      <div className="bg-surface-card border border-hairline rounded-lg overflow-hidden">
        <div className="grid grid-cols-[2fr_0.7fr_1.3fr_1.3fr_0.7fr_1fr] px-5 py-3 bg-surface-dark-elevated border-b border-hairline">
          {["Học viên", "Tuổi", "Thể trạng", "Mục tiêu", "Số buổi", "Buổi gần nhất"].map(
            (h) => (
              <span
                key={h}
                className="text-[12px] font-semibold text-muted uppercase tracking-wide"
              >
                {h}
              </span>
            ),
          )}
        </div>

        {loading ? (
          <div className="p-10 text-center text-muted">Đang tải...</div>
        ) : clients.length === 0 ? (
          <div className="p-10 text-center text-muted">
            Chưa có học viên nào
          </div>
        ) : (
          clients.map((c, index) => (
            <div
              key={c.id}
              className={`grid grid-cols-[2fr_0.7fr_1.3fr_1.3fr_0.7fr_1fr] px-5 py-3.5 items-center ${
                index < clients.length - 1 ? "border-b border-hairline" : ""
              }`}
            >
              <div>
                <p className="text-sm text-ink font-medium">{c.fullName}</p>
                <p className="text-xs text-muted">{c.email}</p>
              </div>
              <span className="text-sm text-muted">{c.age ?? "—"}</span>
              <span className="text-sm text-muted">
                {c.healthStatus ?? "Chưa cập nhật"}
              </span>
              <span className="text-sm text-muted">{c.goal ?? "—"}</span>
              <span className="text-sm text-ink font-medium">
                {c.totalSessions}
              </span>
              <span className="text-sm text-muted">
                {formatDate(c.lastSessionDate)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}