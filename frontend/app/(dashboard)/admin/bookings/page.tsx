"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";

interface Booking {
  id: string;
  date: string;
  timeSlot: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  notes: string | null;
  createdAt: string;
  member: { id: string; fullName: string; email: string };
  trainer: { id: string; fullName: string };
}

interface TrainerOption {
  id: string; // userId
  fullName: string;
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

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trainers, setTrainers] = useState<TrainerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [trainerFilter, setTrainerFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchTrainers = useCallback(async () => {
    try {
      const res = await api.get("/admin/trainers");
      setTrainers(
        res.data.data.trainers.map(
          (t: { user: { id: string; fullName: string } }) => ({
            id: t.user.id,
            fullName: t.user.fullName,
          }),
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter !== "ALL") params.status = statusFilter;
      if (trainerFilter !== "ALL") params.trainerId = trainerFilter;
      if (dateFilter) params.date = dateFilter;

      const res = await api.get("/admin/bookings", { params });
      setBookings(res.data.data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, trainerFilter, dateFilter]);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await api.patch(`/admin/bookings/${id}/status`, { status });
      await fetchBookings();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(`❌ ${error.response?.data?.message || "Không thể cập nhật."}`);
    } finally {
      setUpdatingId(null);
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
          Quản lý đặt lịch
        </h1>
        <p className="text-muted text-body-sm mt-1">
          Xem và xử lý toàn bộ lịch đặt tập trong hệ thống
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap items-end">
        <div className="flex gap-2">
          {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(
            (s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`h-10 px-4 rounded-lg text-[13px] font-medium transition-colors ${
                  statusFilter === s
                    ? "bg-primary text-white"
                    : "bg-surface-card text-muted hover:text-ink"
                }`}
              >
                {s === "ALL" ? "Tất cả" : STATUS_LABEL[s as Booking["status"]]}
              </button>
            ),
          )}
        </div>

        <select
          value={trainerFilter}
          onChange={(e) => setTrainerFilter(e.target.value)}
          className="h-10 px-3.5 bg-surface-dark-soft border border-hairline rounded-lg text-sm text-ink outline-none"
        >
          <option value="ALL">Tất cả huấn luyện viên</option>
          {trainers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.fullName}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="h-10 px-3.5 bg-surface-dark-soft border border-hairline rounded-lg text-sm text-ink outline-none"
        />
        {dateFilter && (
          <button
            onClick={() => setDateFilter("")}
            className="text-body-sm text-muted hover:text-ink underline"
          >
            Xóa lọc ngày
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-surface-card border border-hairline rounded-lg overflow-hidden">
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] px-5 py-3 bg-surface-dark-elevated border-b border-hairline">
          {["Thành viên", "Huấn luyện viên", "Ngày", "Khung giờ", "Trạng thái", "Thao tác"].map(
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
        ) : bookings.length === 0 ? (
          <div className="p-10 text-center text-muted">
            Chưa có lịch đặt nào
          </div>
        ) : (
          bookings.map((b, index) => (
            <div
              key={b.id}
              className={`grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] px-5 py-3.5 items-center ${
                index < bookings.length - 1 ? "border-b border-hairline" : ""
              }`}
            >
              <div>
                <p className="text-sm text-ink font-medium">
                  {b.member.fullName}
                </p>
                <p className="text-xs text-muted">{b.member.email}</p>
              </div>
              <span className="text-sm text-muted">{b.trainer.fullName}</span>
              <span className="text-sm text-muted">{formatDate(b.date)}</span>
              <span className="text-sm text-muted">{b.timeSlot}</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${STATUS_CLASS[b.status]}`}
              >
                {STATUS_LABEL[b.status]}
              </span>

              <div className="flex gap-1.5 flex-wrap">
                {b.status === "PENDING" && (
                  <>
                    <button
                      disabled={updatingId === b.id}
                      onClick={() => handleUpdateStatus(b.id, "CONFIRMED")}
                      className="px-2.5 py-1 text-xs bg-success/10 text-success hover:bg-success/20 rounded-md transition-colors disabled:opacity-50"
                    >
                      Xác nhận
                    </button>
                    <button
                      disabled={updatingId === b.id}
                      onClick={() => handleUpdateStatus(b.id, "CANCELLED")}
                      className="px-2.5 py-1 text-xs bg-error/10 text-error hover:bg-error/20 rounded-md transition-colors disabled:opacity-50"
                    >
                      Hủy
                    </button>
                  </>
                )}
                {b.status === "CONFIRMED" && (
                  <>
                    <button
                      disabled={updatingId === b.id}
                      onClick={() => handleUpdateStatus(b.id, "COMPLETED")}
                      className="px-2.5 py-1 text-xs bg-success/10 text-success hover:bg-success/20 rounded-md transition-colors disabled:opacity-50"
                    >
                      Hoàn thành
                    </button>
                    <button
                      disabled={updatingId === b.id}
                      onClick={() => handleUpdateStatus(b.id, "CANCELLED")}
                      className="px-2.5 py-1 text-xs bg-error/10 text-error hover:bg-error/20 rounded-md transition-colors disabled:opacity-50"
                    >
                      Hủy
                    </button>
                  </>
                )}
                {(b.status === "COMPLETED" || b.status === "CANCELLED") && (
                  <span className="text-xs text-muted-soft">—</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-muted text-[13px] mt-3">
        {bookings.length} lịch đặt
      </p>
    </div>
  );
}