"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

/**
 * API mong đợi:
 * GET  /pt/checkin/today   -> { data: { checkedIn: boolean, checkedInAt: string | null, notes: string | null } }
 * POST /pt/checkin          body: { notes? } -> tạo bản ghi TrainerCheckIn cho hôm nay (trainerId = user hiện tại)
 * GET  /pt/checkin/history -> { data: { history: [{ id, date, checkedInAt, notes }] } }
 */

interface TodayStatus {
  checkedIn: boolean;
  checkedInAt: string | null;
  notes: string | null;
}

interface HistoryItem {
  id: string;
  date: string;
  checkedInAt: string | null;
  notes: string | null;
}

export default function PTCheckinPage() {
  const [today, setToday] = useState<TodayStatus | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    try {
      const [todayRes, historyRes] = await Promise.all([
        api.get("/pt/checkin/today"),
        api.get("/pt/checkin/history"),
      ]);
      setToday(todayRes.data.data);
      setHistory(historyRes.data.data.history);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCheckIn = async () => {
    setSubmitting(true);
    try {
      await api.post("/pt/checkin", { notes: notes.trim() || undefined });
      setNotes("");
      await fetchAll();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(`❌ ${error.response?.data?.message || "Không thể chấm công."}`);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-52">
        <p className="text-muted">Đang tải...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-display-md text-ink">Chấm công</h1>
        <p className="text-muted text-body-sm mt-1">
          Xác nhận bạn đã đến dạy hôm nay để Admin theo dõi
        </p>
      </div>

      {/* Check-in card */}
      <div className="bg-surface-card border border-hairline rounded-lg p-8 mb-6 text-center">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            today?.checkedIn
              ? "bg-success/15"
              : "bg-gradient-to-br from-primary to-accent-amber"
          }`}
        >
          <span className="text-2xl">
            {today?.checkedIn ? "✅" : "🕐"}
          </span>
        </div>

        {today?.checkedIn ? (
          <>
            <h3 className="text-title-md font-display text-ink mb-1">
              Bạn đã chấm công hôm nay
            </h3>
            <p className="text-muted text-body-sm">
              Lúc {today.checkedInAt ? formatDateTime(today.checkedInAt) : "—"}
            </p>
            {today.notes && (
              <p className="text-muted text-body-sm mt-2">
                Ghi chú: {today.notes}
              </p>
            )}
          </>
        ) : (
          <>
            <h3 className="text-title-md font-display text-ink mb-1">
              Bạn chưa chấm công hôm nay
            </h3>
            <p className="text-muted text-body-sm mb-5">
              Bấm nút bên dưới để xác nhận bạn đã đến dạy hôm nay.
            </p>
            <div className="max-w-md mx-auto">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ghi chú (không bắt buộc)..."
                rows={2}
                className="w-full px-3.5 py-2.5 bg-surface-dark-soft border border-hairline rounded-md text-sm text-ink outline-none resize-none placeholder:text-muted mb-3 focus:border-primary transition-colors"
              />
              <button
                onClick={handleCheckIn}
                disabled={submitting}
                className="w-full bg-primary text-white text-sm font-medium py-3 rounded-md hover:bg-primary-active transition-colors disabled:opacity-50"
              >
                {submitting ? "Đang xử lý..." : "✓ Xác nhận đã đến dạy"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* History */}
      <div className="bg-surface-card border border-hairline rounded-lg overflow-hidden">
        <div className="px-5 py-3 bg-surface-dark-elevated border-b border-hairline">
          <span className="text-body-sm font-medium text-ink">
            Lịch sử chấm công gần đây
          </span>
        </div>
        {history.length === 0 ? (
          <div className="p-8 text-center text-muted">
            Chưa có lịch sử chấm công.
          </div>
        ) : (
          history.map((h, index) => (
            <div
              key={h.id}
              className={`flex items-center justify-between px-5 py-3 ${
                index < history.length - 1 ? "border-b border-hairline" : ""
              }`}
            >
              <span className="text-sm text-ink">{formatDate(h.date)}</span>
              <span className="text-sm text-muted">
                {h.checkedInAt ? formatDateTime(h.checkedInAt) : "—"}
              </span>
              <span className="text-sm text-muted-soft">
                {h.notes ?? "—"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}