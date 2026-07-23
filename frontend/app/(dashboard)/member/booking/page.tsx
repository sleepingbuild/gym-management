"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { bookingService, Trainer, Booking } from "@/services/booking.service";

const TIME_SLOTS = [
  "06:00-07:00",
  "07:00-08:00",
  "08:00-09:00",
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
];

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
            <label className="block text-body-sm text-muted mb-1">Khung giờ</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full border border-hairline rounded-md px-3 py-2 bg-surface-card text-ink"
            >
              <option value="">-- Chọn khung giờ --</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
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

          <div>
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

        <Button className="mt-4" onClick={handleSubmit} disabled={submitting}>
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