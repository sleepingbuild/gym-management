"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";

/**
 * API mong đợi (khớp model TrainerCheckIn thật):
 * GET  /admin/trainer-checkins?date=YYYY-MM-DD
 *   -> { data: { date, rows: [{
 *        trainerId, trainerName,
 *        id: string | null,          // TrainerCheckIn.id, null nếu chưa có bản ghi ngày đó
 *        checkedInAt: string | null, // ISO, null nếu chưa chấm công
 *        notes: string | null
 *      }] } }
 *   Lưu ý: cần trả về TẤT CẢ huấn luyện viên (kể cả chưa có bản ghi TrainerCheckIn ngày đó),
 *   không chỉ những ai đã có row trong bảng.
 * POST   /admin/trainer-checkins        body: { trainerId, date }  -> tạo bản ghi, checkedInAt = giờ hiện tại
 * DELETE /admin/trainer-checkins/:id                                -> hủy chấm công (xóa bản ghi)
 */

interface CheckInRow {
  trainerId: string;
  trainerName: string;
  id: string | null;
  checkedInAt: string | null;
  notes: string | null;
}

function todayISODate() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export default function AdminTrainerCheckinsPage() {
  const [date, setDate] = useState(todayISODate());
  const [rows, setRows] = useState<CheckInRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/trainer-checkins", { params: { date } });
      setRows(res.data.data.rows);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCheckIn = async (trainerId: string) => {
    setActingId(trainerId);
    try {
      await api.post("/admin/trainer-checkins", { trainerId, date });
      await fetchData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(`❌ ${error.response?.data?.message || "Không thể chấm công."}`);
    } finally {
      setActingId(null);
    }
  };

  const handleUndoCheckIn = async (id: string) => {
    if (!confirm("Hủy chấm công cho huấn luyện viên này?")) return;
    setActingId(id);
    try {
      await api.delete(`/admin/trainer-checkins/${id}`);
      await fetchData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(`❌ ${error.response?.data?.message || "Không thể hủy."}`);
    } finally {
      setActingId(null);
    }
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDateLabel = (d: string) =>
    new Date(d).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const totalCount = rows.length;
  const checkedInCount = rows.filter((r) => r.checkedInAt).length;
  const notCheckedInCount = totalCount - checkedInCount;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-display-md text-ink">
            Chấm công huấn luyện viên
          </h1>
          <p className="text-muted text-body-sm mt-1">
            Theo dõi trainer nào đã đến dạy trong ngày
          </p>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-10 px-3.5 bg-surface-dark-soft border border-hairline rounded-lg text-sm text-ink outline-none"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface-card border border-hairline rounded-lg p-5">
          <p className="text-caption-uppercase text-muted mb-1">
            Tổng huấn luyện viên
          </p>
          <p className="font-display text-display-sm text-ink">
            {totalCount}
          </p>
        </div>
        <div className="bg-surface-card border border-hairline rounded-lg p-5">
          <p className="text-caption-uppercase text-muted mb-1">
            Đã chấm công
          </p>
          <p className="font-display text-display-sm text-success">
            {checkedInCount}
          </p>
        </div>
        <div className="bg-surface-card border border-hairline rounded-lg p-5">
          <p className="text-caption-uppercase text-muted mb-1">
            Chưa chấm công
          </p>
          <p className="font-display text-display-sm text-error">
            {notCheckedInCount}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-card border border-hairline rounded-lg overflow-hidden">
        <div className="px-5 py-3 bg-surface-dark-elevated border-b border-hairline">
          <span className="text-body-sm font-medium text-ink">
            Ngày {formatDateLabel(date)}
          </span>
        </div>

        <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr_auto] px-5 py-3 bg-surface-dark-elevated/60 border-b border-hairline">
          {["Huấn luyện viên", "Trạng thái", "Giờ chấm công", "Ghi chú", "Thao tác"].map(
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
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-muted">
            Không có huấn luyện viên nào
          </div>
        ) : (
          rows.map((r, index) => (
            <div
              key={r.trainerId}
              className={`grid grid-cols-[2fr_1fr_1fr_1.5fr_auto] px-5 py-3.5 items-center ${
                index < rows.length - 1 ? "border-b border-hairline" : ""
              }`}
            >
              <span className="text-sm text-ink font-medium">
                {r.trainerName}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
                  r.checkedInAt
                    ? "bg-success text-white"
                    : "bg-error text-white"
                }`}
              >
                {r.checkedInAt ? "Đã chấm công" : "Chưa chấm công"}
              </span>
              <span className="text-sm text-muted">
                {r.checkedInAt ? formatTime(r.checkedInAt) : "—"}
              </span>
              <span className="text-sm text-muted truncate">
                {r.notes ?? "—"}
              </span>
              <div>
                {r.checkedInAt && r.id ? (
                  <button
                    disabled={actingId === r.id}
                    onClick={() => handleUndoCheckIn(r.id as string)}
                    className="px-2.5 py-1 text-xs bg-error/10 text-error hover:bg-error/20 rounded-md transition-colors disabled:opacity-50"
                  >
                    Hủy
                  </button>
                ) : (
                  <button
                    disabled={actingId === r.trainerId}
                    onClick={() => handleCheckIn(r.trainerId)}
                    className="px-2.5 py-1 text-xs bg-success/10 text-success hover:bg-success/20 rounded-md transition-colors disabled:opacity-50"
                  >
                    {actingId === r.trainerId ? "Đang lưu..." : "Chấm công"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}