"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import WeekCalendarGrid, { CalendarEvent } from "@/components/schedule/WeekCalendarGrid";
import WeekNav from "@/components/schedule/WeekNav";
import { getMondayUTC, todayUTC, buildWeekDates, isSameUTCDate } from "@/lib/calendarDate";

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

const STATUS_COLOR_CLASS: Record<Booking["status"], string> = {
  PENDING: "bg-warning/90 text-white",
  CONFIRMED: "bg-accent-teal/90 text-white",
  CANCELLED: "bg-error/60 text-white line-through decoration-white/60",
  COMPLETED: "bg-success/90 text-white",
};

const STATUS_BADGE_CLASS: Record<Booking["status"], string> = {
  PENDING: "bg-warning text-white",
  CONFIRMED: "bg-accent-teal text-white",
  CANCELLED: "bg-error text-white",
  COMPLETED: "bg-success text-white",
};

export default function PTSchedulePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState<Date>(() => getMondayUTC(todayUTC()));

  const weekDates = useMemo(() => buildWeekDates(weekStart), [weekStart]);

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

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    const events: CalendarEvent[] = [];
    bookings.forEach((b) => {
      const bDate = new Date(b.date);
      const dayIndex = weekDates.findIndex((d) => isSameUTCDate(d, bDate));
      if (dayIndex === -1) return; // không thuộc tuần đang xem
      events.push({
        id: b.id,
        dayIndex,
        startTime: b.timeSlot.split("-")[0],
        endTime: b.timeSlot.split("-")[1],
        title: b.member.fullName,
        subtitle: STATUS_LABEL[b.status],
        colorClass: STATUS_COLOR_CLASS[b.status],
        onClick: () => setSelectedId(b.id),
      });
    });
    return events;
  }, [bookings, weekDates]);

  const selectedBooking = bookings.find((b) => b.id === selectedId) ?? null;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-display-md text-ink">
          Thời khoá biểu
        </h1>
        <p className="text-muted text-body-sm mt-1">
          Toàn bộ buổi tập đã được đặt với bạn — bấm vào 1 buổi để xem chi tiết
        </p>
      </div>

      <div className="mb-4">
        <WeekNav weekStart={weekStart} onChange={setWeekStart} />
      </div>

      {loading ? (
        <div className="p-10 text-center text-muted">Đang tải...</div>
      ) : (
        <WeekCalendarGrid days={weekDates} events={calendarEvents} />
      )}

      {/* Chi tiết buổi tập được chọn */}
      {selectedBooking && (
        <div className="mt-6 bg-surface-card border border-hairline rounded-lg p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-title-sm font-display text-ink">
                  {selectedBooking.member.fullName}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE_CLASS[selectedBooking.status]}`}
                >
                  {STATUS_LABEL[selectedBooking.status]}
                </span>
              </div>
              <p className="text-body-sm text-muted">
                {formatDate(selectedBooking.date)} · {selectedBooking.timeSlot}
              </p>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="text-muted text-body-sm hover:text-ink"
            >
              Đóng ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-body-sm my-4">
            <p className="text-muted">
              Email: <span className="text-ink">{selectedBooking.member.email}</span>
            </p>
            <p className="text-muted">
              Tuổi: <span className="text-ink">{selectedBooking.age ?? "—"}</span>
            </p>
            <p className="text-muted">
              Ghi chú: <span className="text-ink">{selectedBooking.notes ?? "—"}</span>
            </p>
          </div>

          {selectedBooking.status === "PENDING" && (
            <div className="flex gap-2">
              <button
                disabled={actingId === selectedBooking.id}
                onClick={() => handleUpdateStatus(selectedBooking.id, "CONFIRMED")}
                className="px-3 py-1.5 text-sm bg-success/10 text-success hover:bg-success/20 rounded-md transition-colors disabled:opacity-50"
              >
                Xác nhận
              </button>
              <button
                disabled={actingId === selectedBooking.id}
                onClick={() => handleUpdateStatus(selectedBooking.id, "CANCELLED")}
                className="px-3 py-1.5 text-sm bg-error/10 text-error hover:bg-error/20 rounded-md transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
            </div>
          )}
          {selectedBooking.status === "CONFIRMED" && (
            <div className="flex gap-2">
              <button
                disabled={actingId === selectedBooking.id}
                onClick={() => handleUpdateStatus(selectedBooking.id, "COMPLETED")}
                className="px-3 py-1.5 text-sm bg-success/10 text-success hover:bg-success/20 rounded-md transition-colors disabled:opacity-50"
              >
                Hoàn thành
              </button>
              <button
                disabled={actingId === selectedBooking.id}
                onClick={() => handleUpdateStatus(selectedBooking.id, "CANCELLED")}
                className="px-3 py-1.5 text-sm bg-error/10 text-error hover:bg-error/20 rounded-md transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}