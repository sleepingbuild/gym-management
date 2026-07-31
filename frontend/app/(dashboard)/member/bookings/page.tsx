"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { bookingService, Trainer, Booking, AvailableSlot } from "@/services/booking.service";
import WeekCalendarGrid, { CalendarEvent } from "@/components/schedule/WeekCalendarGrid";
import WeekNav from "@/components/schedule/WeekNav";
import {
  getMondayUTC,
  todayUTC,
  buildWeekDates,
  toISODateUTC,
  isSameUTCDate,
} from "@/lib/calendarDate";

interface SelectedSlot {
  dayIndex: number;
  date: Date;
  timeSlot: string;
}

function MemberBookingPageInner() {
  const searchParams = useSearchParams();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [weekStart, setWeekStart] = useState<Date>(() => getMondayUTC(todayUTC()));
  const [notes, setNotes] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [clickHint, setClickHint] = useState<string | null>(null);

  // slotsByDay[dayIndex] = danh sách khung giờ thật của HLV cho ngày đó
  const [slotsByDay, setSlotsByDay] = useState<Record<number, AvailableSlot[]>>({});
  const [loadingSlots, setLoadingSlots] = useState(false);

  const weekDates = useMemo(() => buildWeekDates(weekStart), [weekStart]);
  const today = todayUTC();
  const disabledDayIndexes = useMemo(
    () => weekDates.map((d, i) => (d.getTime() < today.getTime() ? i : -1)).filter((i) => i !== -1),
    [weekDates, today],
  );

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

  // Nếu được điều hướng từ trang "Huấn luyện viên" kèm ?trainerId=..., tự chọn sẵn HLV đó
  useEffect(() => {
    if (loading || selectedTrainer) return;
    const trainerIdFromUrl = searchParams.get("trainerId");
    if (trainerIdFromUrl && trainers.some((t) => t.user.id === trainerIdFromUrl)) {
      setSelectedTrainer(trainerIdFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, trainers, searchParams]);

  // Mỗi khi đổi HLV hoặc tuần đang xem -> load lại khung giờ thật cho cả 7 ngày
  useEffect(() => {
    setSelectedSlot(null);
    setClickHint(null);

    if (!selectedTrainer) {
      setSlotsByDay({});
      return;
    }

    let cancelled = false;
    setLoadingSlots(true);

    Promise.all(
      weekDates.map((d) => bookingService.getAvailableSlots(selectedTrainer, toISODateUTC(d))),
    )
      .then((results) => {
        if (cancelled) return;
        const map: Record<number, AvailableSlot[]> = {};
        results.forEach((r, i) => {
          map[i] = r.slots;
        });
        setSlotsByDay(map);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setSlotsByDay({});
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrainer, weekStart]);

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    const events: CalendarEvent[] = [];
    Object.entries(slotsByDay).forEach(([dayIndexStr, slots]) => {
      const dayIndex = Number(dayIndexStr);
      if (disabledDayIndexes.includes(dayIndex)) return; // ngày đã qua, không hiện để đặt

      slots.forEach((s) => {
        if (!s.withinWorkingHours) return; // ngoài giờ làm việc -> không vẽ ô
        const [startTime, endTime] = s.timeSlot.split("-");
        const isSelected =
          selectedSlot?.dayIndex === dayIndex && selectedSlot?.timeSlot === s.timeSlot;

        events.push({
          id: `${dayIndex}-${s.timeSlot}`,
          dayIndex,
          startTime,
          endTime,
          title: isSelected ? "Đang chọn" : s.available ? "Còn trống" : "Đã đặt",
          colorClass: isSelected
            ? "bg-accent-orange text-white ring-2 ring-white/70"
            : s.available
            ? "bg-success/80 text-white"
            : "bg-error/50 text-white",
          onClick: s.available
            ? () => {
                setClickHint(null);
                setSelectedSlot({
                  dayIndex,
                  date: weekDates[dayIndex],
                  timeSlot: s.timeSlot,
                });
              }
            : () => {
                setSelectedSlot(null);
                setClickHint("Khung giờ này đã có người đặt, vui lòng chọn khung giờ khác.");
              },
        });
      });
    });
    return events;
  }, [slotsByDay, selectedSlot, weekDates, disabledDayIndexes]);

  // Bấm vào 1 ô trên lưới (kể cả ô trống, không chỉ khối màu đã dựng sẵn) ->
  // tìm đúng khung giờ chuẩn tương ứng và chọn nếu còn trống, hoặc báo lý do nếu không.
  const handleSlotCellClick = (dayIndex: number, hour: number) => {
    if (!selectedTrainer) return;
    const hourLabel = `${String(hour).padStart(2, "0")}:00`;
    const slot = (slotsByDay[dayIndex] ?? []).find((s) => s.timeSlot.startsWith(hourLabel));

    if (!slot || !slot.withinWorkingHours) {
      setSelectedSlot(null);
      setClickHint("Huấn luyện viên không làm việc trong khung giờ này.");
      return;
    }
    if (!slot.available) {
      setSelectedSlot(null);
      setClickHint("Khung giờ này đã có người đặt, vui lòng chọn khung giờ khác.");
      return;
    }
    setClickHint(null);
    setSelectedSlot({ dayIndex, date: weekDates[dayIndex], timeSlot: slot.timeSlot });
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!selectedTrainer || !selectedSlot) {
      setError("Vui lòng chọn huấn luyện viên và khung giờ trên lịch.");
      return;
    }
    setClickHint(null);

    setSubmitting(true);
    try {
      await bookingService.createBooking({
        trainerId: selectedTrainer,
        date: toISODateUTC(selectedSlot.date),
        timeSlot: selectedSlot.timeSlot,
        notes: notes || undefined,
      });
      setSuccess("Đặt lịch thành công! Vui lòng chờ huấn luyện viên xác nhận.");
      setSelectedSlot(null);
      setNotes("");
      await fetchData();
      // Tải lại khung giờ tuần hiện tại để phản ánh slot vừa đặt
      if (selectedTrainer) {
        const results = await Promise.all(
          weekDates.map((d) => bookingService.getAvailableSlots(selectedTrainer, toISODateUTC(d))),
        );
        const map: Record<number, AvailableSlot[]> = {};
        results.forEach((r, i) => {
          map[i] = r.slots;
        });
        setSlotsByDay(map);
      }
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

  const calendarHint = () => {
    if (!selectedTrainer) return "Chọn huấn luyện viên để xem lịch trống trong tuần";
    if (loadingSlots) return "Đang tải lịch...";
    const hasAnySlotThisWeek = Object.values(slotsByDay).some((slots) =>
      slots.some((s) => s.withinWorkingHours),
    );
    if (!hasAnySlotThisWeek)
      return "⚠️ Huấn luyện viên không có ca làm việc nào trong tuần này. Hãy thử tuần khác.";
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display-md font-display text-ink">Đặt lịch huấn luyện</h1>
        <p className="text-body text-muted mt-1">
          Chọn huấn luyện viên, sau đó bấm vào khung giờ còn trống trên lịch
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

        <div className="mb-4">
          <label className="block text-body-sm text-muted mb-1">Huấn luyện viên</label>
          <select
            value={selectedTrainer}
            onChange={(e) => setSelectedTrainer(e.target.value)}
            className="w-full md:w-96 border border-hairline rounded-md px-3 py-2 bg-surface-card text-ink"
          >
            <option value="">-- Chọn HLV --</option>
            {trainers.map((t) => (
              <option key={t.id} value={t.user.id}>
                {t.user.fullName} — {t.specialties}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 text-body-sm mb-2 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-success/80 inline-block" /> Còn trống
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-error/50 inline-block" /> Đã đặt
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-accent-orange inline-block" /> Đang chọn
          </span>
        </div>

        <div className="mb-4">
          <WeekNav weekStart={weekStart} onChange={setWeekStart} />
        </div>

        {calendarHint() && (
          <p className="text-body-sm text-warning mb-3 bg-warning/10 border border-warning/30 rounded-md px-3 py-2">
            {calendarHint()}
          </p>
        )}
        {!calendarHint() && clickHint && (
          <p className="text-body-sm text-warning mb-3 bg-warning/10 border border-warning/30 rounded-md px-3 py-2">
            {clickHint}
          </p>
        )}

        {selectedTrainer && (
          <WeekCalendarGrid
            days={weekDates}
            events={calendarEvents}
            disabledDayIndexes={disabledDayIndexes}
            onSlotClick={handleSlotCellClick}
          />
        )}

        {selectedSlot && (
          <div className="mt-4 bg-surface-dark-elevated border border-hairline rounded-lg p-4">
            <p className="text-body-sm text-ink font-medium mb-3">
              Bạn chọn: khung giờ {selectedSlot.timeSlot} — ngày{" "}
              {toISODateUTC(selectedSlot.date).split("-").reverse().join("/")}
            </p>
            <label className="block text-body-sm text-muted mb-1">Ghi chú (tùy chọn)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Mục tiêu buổi tập..."
              className="w-full border border-hairline rounded-md px-3 py-2 bg-surface-card text-ink mb-3"
            />
            <div className="flex gap-3">
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Đang xử lý..." : "Xác nhận đặt lịch"}
              </Button>
              <Button variant="secondary" onClick={() => setSelectedSlot(null)}>
                Hủy chọn
              </Button>
            </div>
          </div>
        )}
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

export default function MemberBookingPage() {
  return (
    <Suspense fallback={<p className="text-body text-muted text-center py-10">Đang tải...</p>}>
      <MemberBookingPageInner />
    </Suspense>
  );
}