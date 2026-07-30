"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { bookingService, Trainer, Booking, AvailableSlot } from "@/services/booking.service";

export default function MemberBookingPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");

  // Khung giờ thật của HLV đã chọn, cho đúng ngày đã chọn
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [hasSchedule, setHasSchedule] = useState(true);

  const fetchData = async () => {
    try {
      const [trainersData, bookingsData] = await Promise.all([
        bookingService.getAvailableTrainers(),
        bookingService.getMyBookings(),
      ]);
      setTrainers(trainersData);
      setBookings(bookingsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Mỗi khi đổi HLV hoặc ngày -> load lại khung giờ thật, bỏ lựa chọn khung giờ cũ
  useEffect(() => {
    setTimeSlot("");
    setSlots([]);

    if (!selectedTrainer || !date) {
      setHasSchedule(true);
      return;
    }

    let cancelled = false;
    setLoadingSlots(true);

    bookingService
      .getAvailableSlots(selectedTrainer, date)
      .then((result) => {
        if (cancelled) return;
        setSlots(result.slots);
        setHasSchedule(result.hasSchedule);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setSlots([]);
        setHasSchedule(true);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedTrainer, date]);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!selectedTrainer || !date || !timeSlot) {
      setError("Vui lòng chọn đầy đủ huấn luyện viên, ngày và khung giờ.");
      return;
    }

    setSubmitting(true);
    try {
      await bookingService.createBooking({
        trainerId: selectedTrainer,
        date,
        timeSlot,
        notes: notes || undefined,
      });
      setSuccess("Đặt lịch thành công! Vui lòng chờ huấn luyện viên xác nhận.");
      setSelectedTrainer("");
      setDate("");
      setTimeSlot("");
      setNotes("");
      await fetchData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Đặt lịch thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await bookingService.cancelBooking(id);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const statusLabel = (status: Booking["status"]) => {
    switch (status) {
      case "PENDING":
        return { text: "Chờ xác nhận", color: "text-warning" };
      case "CONFIRMED":
        return { text: "Đã xác nhận", color: "text-success" };
      case "CANCELLED":
        return { text: "Đã hủy", color: "text-muted" };
      case "COMPLETED":
        return { text: "Hoàn thành", color: "text-primary" };
    }
  };

  const slotHelperText = () => {
    if (!selectedTrainer || !date) return "Chọn huấn luyện viên và ngày để xem khung giờ trống";
    if (loadingSlots) return "Đang tải khung giờ...";
    if (!hasSchedule) return "Huấn luyện viên chưa có lịch làm việc vào ngày này";
    if (slots.length > 0 && slots.every((s) => !s.available))
      return "Tất cả khung giờ trong ngày này đã kín";
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display-md font-display text-ink">Đặt lịch huấn luyện</h1>
        <p className="text-body text-muted mt-1">
          Chọn huấn luyện viên và khung giờ phù hợp với bạn
        </p>
      </div>

      {error && (
        <div className="bg-error/10 text-error border border-error/30 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-success/10 text-success border border-success/30 rounded-lg p-4 text-sm">
          {success}
        </div>
      )}

      <Card className="p-6">
        <h3 className="text-title-md font-display text-ink mb-4">Đặt lịch mới</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-body-sm text-muted mb-1">Huấn luyện viên</label>
            <select
              value={selectedTrainer}
              onChange={(e) => setSelectedTrainer(e.target.value)}
              className="w-full border border-hairline rounded-md px-3 py-2 bg-surface-card text-ink"
            >
              <option value="">-- Chọn HLV --</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.user.id}>
                  {t.user.fullName} — {t.specialties}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-body-sm text-muted mb-1">Ngày tập</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-hairline rounded-md px-3 py-2 bg-surface-card text-ink"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-body-sm text-muted mb-1">Khung giờ</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              disabled={!selectedTrainer || !date || loadingSlots || slots.length === 0}
              className="w-full border border-hairline rounded-md px-3 py-2 bg-surface-card text-ink disabled:opacity-50"
            >
              <option value="">-- Chọn khung giờ --</option>
              {slots.map((s) => (
                <option key={s.timeSlot} value={s.timeSlot} disabled={!s.available}>
                  {s.timeSlot}{!s.available ? " (Đã kín)" : ""}
                </option>
              ))}
            </select>
            {slotHelperText() && (
              <p className="text-body-sm text-muted mt-1">{slotHelperText()}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-body-sm text-muted mb-1">Ghi chú (tùy chọn)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Mục tiêu buổi tập..."
              className="w-full border border-hairline rounded-md px-3 py-2 bg-surface-card text-ink"
            />
          </div>
        </div>

        <Button className="mt-4" onClick={handleSubmit} disabled={submitting || !timeSlot}>
          {submitting ? "Đang xử lý..." : "Đặt lịch"}
        </Button>
      </Card>

      <Card className="p-6">
        <h3 className="text-title-md font-display text-ink mb-4">Lịch hẹn của tôi</h3>
        {loading ? (
          <p className="text-body text-muted text-center py-4">Đang tải...</p>
        ) : bookings.length === 0 ? (
          <p className="text-body text-muted text-center py-4">Chưa có lịch hẹn nào</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => {
              const status = statusLabel(b.status);
              return (
                <div
                  key={b.id}
                  className="flex items-center justify-between border border-hairline rounded-lg p-4"
                >
                  <div>
                    <p className="font-medium text-ink">
                      {b.trainer.fullName} — {b.timeSlot}
                    </p>
                    <p className="text-body-sm text-muted">
                      {new Date(b.date).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-body-sm font-medium ${status.color}`}>
                      {status.text}
                    </span>
                    {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="text-error text-body-sm hover:underline"
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}