"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import WeekCalendarGrid, { CalendarEvent } from "@/components/schedule/WeekCalendarGrid";
import WeekNav from "@/components/schedule/WeekNav";
import {
  getMondayUTC,
  todayUTC,
  buildWeekDates,
  isSameUTCDate,
  toISODateUTC,
  jsDayToGridIndex,
  gridIndexToJsDay,
} from "@/lib/calendarDate";

/**
 * API mong đợi (khớp model TrainerSchedule thật):
 * GET    /admin/trainer-schedules?trainerId=            -> { data: { schedules: Schedule[] } }
 * POST   /admin/trainer-schedules                       -> body: FormData bên dưới
 * PUT    /admin/trainer-schedules/:id                    -> body giống trên
 * DELETE /admin/trainer-schedules/:id
 */

type ScheduleType = "RECURRING" | "SPECIFIC_DATE";

interface Schedule {
  id: string;
  trainerId: string;
  type: ScheduleType;
  dayOfWeek: number | null;
  specificDate: string | null; // ISO date
  startTime: string; // "HH:mm"
  endTime: string;
  notes: string | null;
  trainer: { id: string; fullName: string };
}

interface TrainerOption {
  id: string;
  fullName: string;
}

interface FormData {
  trainerId: string;
  type: ScheduleType;
  dayOfWeek: number;
  specificDate: string; // yyyy-mm-dd
  startTime: string;
  endTime: string;
  notes: string;
}

const DAY_LABELS = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];

const emptyForm: FormData = {
  trainerId: "",
  type: "RECURRING",
  dayOfWeek: 1,
  specificDate: "",
  startTime: "08:00",
  endTime: "17:00",
  notes: "",
};

export default function AdminTrainerSchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [trainers, setTrainers] = useState<TrainerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTrainerId, setFilterTrainerId] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [weekStart, setWeekStart] = useState<Date>(() => getMondayUTC(todayUTC()));

  const weekDates = useMemo(() => buildWeekDates(weekStart), [weekStart]);

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

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filterTrainerId !== "ALL") params.trainerId = filterTrainerId;
      const res = await api.get("/admin/trainer-schedules", { params });
      setSchedules(res.data.data.schedules);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterTrainerId]);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const openCreateForm = () => {
    if (trainers.length === 0) {
      alert("Chưa có huấn luyện viên nào trong hệ thống. Hãy thêm HLV trước.");
      return;
    }
    setEditingId(null);
    setForm({ ...emptyForm, trainerId: trainers[0]?.id ?? "" });
    setShowForm(true);
  };

  const openEditForm = (s: Schedule) => {
    setEditingId(s.id);
    setForm({
      trainerId: s.trainerId,
      type: s.type,
      dayOfWeek: s.dayOfWeek ?? 1,
      specificDate: s.specificDate ? s.specificDate.slice(0, 10) : "",
      startTime: s.startTime,
      endTime: s.endTime,
      notes: s.notes ?? "",
    });
    setShowForm(true);
  };

  // Bấm vào 1 ô trống trên lưới -> mở form tạo, điền sẵn ngày cụ thể + giờ đã bấm
  const openCreateFormFromSlot = (dayIndex: number, hour: number) => {
    if (trainers.length === 0) {
      alert("Chưa có huấn luyện viên nào trong hệ thống. Hãy thêm HLV trước.");
      return;
    }
    const clickedDate = weekDates[dayIndex];
    const startTime = `${String(hour).padStart(2, "0")}:00`;
    const endTime = `${String(Math.min(hour + 1, 23)).padStart(2, "0")}:00`;
    setEditingId(null);
    setForm({
      trainerId: filterTrainerId !== "ALL" ? filterTrainerId : (trainers[0]?.id ?? ""),
      type: "SPECIFIC_DATE",
      dayOfWeek: gridIndexToJsDay(dayIndex),
      specificDate: toISODateUTC(clickedDate),
      startTime,
      endTime,
      notes: "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.trainerId) {
      alert("Vui lòng chọn huấn luyện viên.");
      return;
    }
    if (form.type === "SPECIFIC_DATE" && !form.specificDate) {
      alert("Vui lòng chọn ngày cụ thể.");
      return;
    }
    if (form.startTime >= form.endTime) {
      alert("Giờ bắt đầu phải trước giờ kết thúc.");
      return;
    }

    const payload =
      form.type === "RECURRING"
        ? {
            trainerId: form.trainerId,
            type: form.type,
            dayOfWeek: form.dayOfWeek,
            startTime: form.startTime,
            endTime: form.endTime,
            notes: form.notes || null,
          }
        : {
            trainerId: form.trainerId,
            type: form.type,
            specificDate: form.specificDate,
            startTime: form.startTime,
            endTime: form.endTime,
            notes: form.notes || null,
          };

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/admin/trainer-schedules/${editingId}`, payload);
      } else {
        await api.post("/admin/trainer-schedules", payload);
      }
      await fetchSchedules();
      closeForm();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(`❌ ${error.response?.data?.message || "Có lỗi xảy ra."}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa ca làm việc này?")) return;
    try {
      await api.delete(`/admin/trainer-schedules/${id}`);
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(`❌ ${error.response?.data?.message || "Không thể xóa."}`);
    }
  };

  // Màu theo từng HLV để phân biệt khi xem "Tất cả huấn luyện viên"
  const TRAINER_COLORS = [
    "bg-accent-orange/90 text-white",
    "bg-accent-teal/90 text-white",
    "bg-accent-amber/90 text-white",
    "bg-purple-500/90 text-white",
    "bg-blue-500/90 text-white",
    "bg-pink-500/90 text-white",
  ];
  const colorForTrainer = (trainerId: string) => {
    const idx = trainers.findIndex((t) => t.id === trainerId);
    return TRAINER_COLORS[(idx < 0 ? 0 : idx) % TRAINER_COLORS.length];
  };

  // Ca RECURRING lặp lại mỗi tuần (theo dayOfWeek), ca SPECIFIC_DATE chỉ hiện
  // đúng tuần chứa ngày đó.
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    const events: CalendarEvent[] = [];
    schedules.forEach((s) => {
      if (s.type === "RECURRING" && s.dayOfWeek !== null) {
        events.push({
          id: s.id,
          dayIndex: jsDayToGridIndex(s.dayOfWeek),
          startTime: s.startTime,
          endTime: s.endTime,
          title: s.trainer.fullName,
          subtitle: s.notes ?? "Hàng tuần",
          colorClass: colorForTrainer(s.trainerId),
          onClick: () => openEditForm(s),
        });
      } else if (s.type === "SPECIFIC_DATE" && s.specificDate) {
        const sd = new Date(s.specificDate);
        const dayIndex = weekDates.findIndex((d) => isSameUTCDate(d, sd));
        if (dayIndex === -1) return; // ca này không thuộc tuần đang xem
        events.push({
          id: s.id,
          dayIndex,
          startTime: s.startTime,
          endTime: s.endTime,
          title: s.trainer.fullName,
          subtitle: s.notes ?? "Ngày cụ thể",
          colorClass: colorForTrainer(s.trainerId),
          onClick: () => openEditForm(s),
        });
      }
    });
    return events;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedules, weekDates, trainers]);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-display-md text-ink">
            Lịch làm việc huấn luyện viên
          </h1>
          <p className="text-muted text-body-sm mt-1">
            Quản lý ca làm việc theo từng huấn luyện viên — bấm vào ô trống để thêm ca mới
          </p>
        </div>
        <Button onClick={openCreateForm}>+ Thêm lịch làm việc</Button>
      </div>

      {/* Filter */}
      <div className="bg-surface-card border border-hairline rounded-lg p-4 mb-4">
        <label className="text-body-sm text-muted block mb-2">
          Lọc theo huấn luyện viên
        </label>
        <select
          value={filterTrainerId}
          onChange={(e) => setFilterTrainerId(e.target.value)}
          className="w-full md:w-80 h-10 px-3.5 bg-surface-dark-soft border border-hairline rounded-lg text-sm text-ink outline-none"
        >
          <option value="ALL">Tất cả huấn luyện viên</option>
          {trainers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <Card className="mb-6">
          <h3 className="text-title-md font-display text-ink mb-4">
            {editingId ? "Cập nhật ca làm việc" : "Thêm ca làm việc"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-body-sm font-medium text-body">
                  Huấn luyện viên
                </label>
                <select
                  value={form.trainerId}
                  onChange={(e) =>
                    setForm({ ...form, trainerId: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-surface-dark-soft border border-hairline rounded-md text-ink text-body-md"
                >
                  <option value="">-- Chọn huấn luyện viên --</option>
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-body-sm font-medium text-body">
                  Loại lịch
                </label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as ScheduleType })
                  }
                  className="w-full px-3.5 py-2.5 bg-surface-dark-soft border border-hairline rounded-md text-ink text-body-md"
                >
                  <option value="RECURRING">Cố định hàng tuần</option>
                  <option value="SPECIFIC_DATE">Một ngày cụ thể</option>
                </select>
              </div>

              {form.type === "RECURRING" ? (
                <div className="space-y-1.5">
                  <label className="text-body-sm font-medium text-body">
                    Thứ trong tuần
                  </label>
                  <select
                    value={form.dayOfWeek}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        dayOfWeek: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-surface-dark-soft border border-hairline rounded-md text-ink text-body-md"
                  >
                    {DAY_LABELS.map((label, i) => (
                      <option key={i} value={i}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <Input
                  label="Ngày cụ thể"
                  type="date"
                  required
                  value={form.specificDate}
                  onChange={(e) =>
                    setForm({ ...form, specificDate: e.target.value })
                  }
                />
              )}

              <Input
                label="Giờ bắt đầu"
                type="time"
                required
                value={form.startTime}
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
              />
              <Input
                label="Giờ kết thúc"
                type="time"
                required
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              />
            </div>
            <Input
              label="Ghi chú"
              type="text"
              placeholder="VD: Ca sáng phòng gym A"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Tạo ca"}
              </Button>
              <Button type="button" variant="secondary" onClick={closeForm}>
                Hủy
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="secondary"
                  className="text-error"
                  onClick={() => {
                    handleDelete(editingId);
                    closeForm();
                  }}
                >
                  Xóa ca này
                </Button>
              )}
            </div>
          </form>
        </Card>
      )}

      {/* Lịch tuần */}
      <div className="mb-4">
        <WeekNav weekStart={weekStart} onChange={setWeekStart} />
      </div>

      {loading ? (
        <p className="text-muted text-center py-10">Đang tải...</p>
      ) : trainers.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-muted mb-4">Chưa có huấn luyện viên nào trong hệ thống.</p>
        </Card>
      ) : (
        <WeekCalendarGrid
          days={weekDates}
          events={calendarEvents}
          onSlotClick={openCreateFormFromSlot}
        />
      )}
    </div>
  );
}