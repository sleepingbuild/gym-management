"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

/**
 * API mong đợi:
 * GET   /pt/bookings -> { data: { bookings: [{
 *   id, date, timeSlot, status, notes, age,
 *   member: { id, fullName, email }
 * }] } }
 * PATCH /pt/bookings/:id/status  body: { status: "CONFIRMED" | "CANCELLED" | "COMPLETED" }
 *   (chuyển hợp lệ: PENDING->CONFIRMED/CANCELLED, CONFIRMED->COMPLETED/CANCELLED — giống bên Admin)
 */

interface Booking {
  id: string;
  date: string;
  timeSlot: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  notes: string | null;
  age: number | null;
  member: { id: string; fullName: string; email: string };
}

const STATUS_LABEL: Record<Booking["status"], string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  CANCELLED: "Đã hủy",
  COMPLETED: "Hoàn thành",
};

const STATUS_CLASS: Record<Booking["status"], string> = {
  PENDING: "bg-warning text-white",
  CONFIRMED: "bg-accent-teal text-white",
  CANCELLED: "bg-error text-white",
  COMPLETED: "bg-success text-white",
};

export default function PTSchedulePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/pt/bookings");
      setBookings(res.data.data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    setActingId(id);
    try {
      await api.patch(`/pt/bookings/${id}/status`, { status });
      await fetchBookings();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(`❌ ${error.response?.data?.message || "Không thể cập nhật."}`);
    } finally {
      setActingId(null);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-display-md text-ink">
          Thời khoá biểu
        </h1>
        <p className="text-muted text-body-sm mt-1">
          Toàn bộ buổi tập đã được đặt với bạn — bấm vào 1 buổi để xem chi tiết
        </p>
      </div>

      {/* Table */}
      <div className="bg-surface-card border border-hairline rounded-lg overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_1.5fr_1fr_auto] px-5 py-3 bg-surface-dark-elevated border-b border-hairline">
          {["Ngày", "Giờ", "Học viên", "Trạng thái", "Thao tác"].map((h) => (
            <span
              key={h}
              className="text-[12px] font-semibold text-muted uppercase tracking-wide"
            >
              {h}
            </span>
          ))}
        </div>

        {loading ? (
          <div className="p-10 text-center text-muted">Đang tải...</div>
        ) : bookings.length === 0 ? (
          <div className="p-10 text-center text-muted">
            Chưa có buổi tập nào
          </div>
        ) : (
          bookings.map((b, index) => (
            <div key={b.id}>
              <div
                className={`grid grid-cols-[1fr_1fr_1.5fr_1fr_auto] px-5 py-3.5 items-center ${
                  index < bookings.length - 1 && expandedId !== b.id
                    ? "border-b border-hairline"
                    : ""
                }`}
              >
                <span className="text-sm text-muted">{formatDate(b.date)}</span>
                <span className="text-sm text-muted">{b.timeSlot}</span>
                <span className="text-sm text-ink font-medium">
                  {b.member.fullName}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${STATUS_CLASS[b.status]}`}
                >
                  {STATUS_LABEL[b.status]}
                </span>
                <button
                  onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
                  className="px-2.5 py-1 text-xs bg-surface-dark-elevated text-ink rounded-md hover:bg-hairline transition-colors w-fit"
                >
                  {expandedId === b.id ? "Ẩn" : "Chi tiết"}
                </button>
              </div>

              {expandedId === b.id && (
                <div
                  className={`px-5 pb-4 pt-1 bg-surface-dark-elevated/40 ${
                    index < bookings.length - 1 ? "border-b border-hairline" : ""
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-body-sm mb-3">
                    <p className="text-muted">
                      Email: <span className="text-ink">{b.member.email}</span>
                    </p>
                    <p className="text-muted">
                      Tuổi: <span className="text-ink">{b.age ?? "—"}</span>
                    </p>
                    <p className="text-muted">
                      Ghi chú: <span className="text-ink">{b.notes ?? "—"}</span>
                    </p>
                  </div>

                  {b.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button
                        disabled={actingId === b.id}
                        onClick={() => handleUpdateStatus(b.id, "CONFIRMED")}
                        className="px-2.5 py-1 text-xs bg-success/10 text-success hover:bg-success/20 rounded-md transition-colors disabled:opacity-50"
                      >
                        Xác nhận
                      </button>
                      <button
                        disabled={actingId === b.id}
                        onClick={() => handleUpdateStatus(b.id, "CANCELLED")}
                        className="px-2.5 py-1 text-xs bg-error/10 text-error hover:bg-error/20 rounded-md transition-colors disabled:opacity-50"
                      >
                        Hủy
                      </button>
                    </div>
                  )}
                  {b.status === "CONFIRMED" && (
                    <div className="flex gap-2">
                      <button
                        disabled={actingId === b.id}
                        onClick={() => handleUpdateStatus(b.id, "COMPLETED")}
                        className="px-2.5 py-1 text-xs bg-success/10 text-success hover:bg-success/20 rounded-md transition-colors disabled:opacity-50"
                      >
                        Hoàn thành
                      </button>
                      <button
                        disabled={actingId === b.id}
                        onClick={() => handleUpdateStatus(b.id, "CANCELLED")}
                        className="px-2.5 py-1 text-xs bg-error/10 text-error hover:bg-error/20 rounded-md transition-colors disabled:opacity-50"
                      >
                        Hủy
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}