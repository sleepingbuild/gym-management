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

interface BulkFormData {
  trainerIds: string[];
  type: ScheduleType;
  daysOfWeek: number[];
  specificDate: string;
  startTime: string;
  endTime: string;
  notes: string;
}

const emptyBulkForm: BulkFormData = {
  trainerIds: [],
  type: "RECURRING",
  daysOfWeek: [1, 2, 3, 4, 5],
  specificDate: "",
  startTime: "08:00",
  endTime: "17:00",
  notes: "",
};

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
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [bulkForm, setBulkForm] = useState<BulkFormData>(emptyBulkForm);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkResult, setBulkResult] = useState<{
    createdCount: number;
    skipped: { trainerId: string; reason: string }[];
  } | null>(null);
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

  const openBulkForm = () => {
    if (trainers.length === 0) {
      alert("Chưa có huấn luyện viên nào trong hệ thống. Hãy thêm HLV trước.");
      return;
    }
    setBulkResult(null);
    setBulkForm(emptyBulkForm);
    setShowBulkForm(true);
  };

  const closeBulkForm = () => {
    setShowBulkForm(false);
    setBulkForm(emptyBulkForm);
    setBulkResult(null);
  };

  const toggleBulkTrainer = (trainerId: string) => {
    setBulkForm((prev) => ({
      ...prev,
      trainerIds: prev.trainerIds.includes(trainerId)
        ? prev.trainerIds.filter((id) => id !== trainerId)
        : [...prev.trainerIds, trainerId],
    }));
  };

  const toggleAllBulkTrainers = () => {
    setBulkForm((prev) => ({
      ...prev,
      trainerIds: prev.trainerIds.length === trainers.length ? [] : trainers.map((t) => t.id),
    }));
  };

  const toggleBulkDay = (day: number) => {
    setBulkForm((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day].sort((a, b) => a - b),
    }));
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkForm.trainerIds.length === 0) {
      alert("Vui lòng chọn ít nhất 1 huấn luyện viên.");
      return;
    }
    if (bulkForm.type === "RECURRING" && bulkForm.daysOfWeek.length === 0) {
      alert("Vui lòng chọn ít nhất 1 thứ trong tuần.");
      return;
    }
    if (bulkForm.type === "SPECIFIC_DATE" && !bulkForm.specificDate) {
      alert("Vui lòng chọn ngày cụ thể.");
      return;
    }
    if (bulkForm.startTime >= bulkForm.endTime) {
      alert("Giờ bắt đầu phải trước giờ kết thúc.");
      return;
    }

    const payload =
      bulkForm.type === "RECURRING"
        ? {
            trainerIds: bulkForm.trainerIds,
            type: bulkForm.type,
            daysOfWeek: bulkForm.daysOfWeek,
            startTime: bulkForm.startTime,
            endTime: bulkForm.endTime,
            notes: bulkForm.notes || null,
          }
        : {
            trainerIds: bulkForm.trainerIds,
            type: bulkForm.type,
            specificDate: bulkForm.specificDate,
            startTime: bulkForm.startTime,
            endTime: bulkForm.endTime,
            notes: bulkForm.notes || null,
          };

    setBulkSaving(true);
    setBulkResult(null);
    try {
      const res = await api.post("/admin/trainer-schedules/bulk", payload);
      setBulkResult(res.data.data);
      await fetchSchedules();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(`❌ ${error.response?.data?.message || "Có lỗi xảy ra."}`);
    } finally {
      setBulkSaving(false);
    }
  };

  const trainerName = (trainerId: string) =>
    trainers.find((t) => t.id === trainerId)?.fullName ?? trainerId;

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
        <div className="flex gap-2">
          <Button variant="secondary" onClick={openBulkForm}>
            + Tạo lịch hàng loạt
          </Button>
          <Button onClick={openCreateForm}>+ Thêm lịch làm việc</Button>
        </div>
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

      {/* Bulk create form */}
      {showBulkForm && (
        <Card className="mb-6">
          <h3 className="text-title-md font-display text-ink mb-1">
            Tạo lịch hàng loạt
          </h3>
          <p className="text-body-sm text-muted mb-4">
            Áp 1 mẫu ca cho nhiều huấn luyện viên cùng lúc — tổ hợp nào trùng giờ với ca
            đã có sẽ tự bị bỏ qua.
          </p>
          <form onSubmit={handleBulkSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-body-sm font-medium text-body">
                  Huấn luyện viên ({bulkForm.trainerIds.length}/{trainers.length})
                </label>
                <button
                  type="button"
                  onClick={toggleAllBulkTrainers}
                  className="text-body-sm text-primary hover:underline"
                >
                  {bulkForm.trainerIds.length === trainers.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-surface-dark-soft border border-hairline rounded-md">
                {trainers.map((t) => (
                  <label key={t.id} className="flex items-center gap-2 text-body-sm text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bulkForm.trainerIds.includes(t.id)}
                      onChange={() => toggleBulkTrainer(t.id)}
                    />
                    {t.fullName}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-body-sm font-medium text-body">Loại lịch</label>
                <select
                  value={bulkForm.type}
                  onChange={(e) =>
                    setBulkForm({ ...bulkForm, type: e.target.value as ScheduleType })
                  }
                  className="w-full px-3.5 py-2.5 bg-surface-dark-soft border border-hairline rounded-md text-ink text-body-md"
                >
                  <option value="RECURRING">Cố định hàng tuần</option>
                  <option value="SPECIFIC_DATE">Một ngày cụ thể</option>
                </select>
              </div>

              {bulkForm.type === "SPECIFIC_DATE" && (
                <Input
                  label="Ngày cụ thể"
                  type="date"
                  required
                  value={bulkForm.specificDate}
                  onChange={(e) => setBulkForm({ ...bulkForm, specificDate: e.target.value })}
                />
              )}

              <Input
                label="Giờ bắt đầu"
                type="time"
                required
                value={bulkForm.startTime}
                onChange={(e) => setBulkForm({ ...bulkForm, startTime: e.target.value })}
              />
              <Input
                label="Giờ kết thúc"
                type="time"
                required
                value={bulkForm.endTime}
                onChange={(e) => setBulkForm({ ...bulkForm, endTime: e.target.value })}
              />
            </div>

            {bulkForm.type === "RECURRING" && (
              <div>
                <label className="text-body-sm font-medium text-body block mb-1.5">
                  Các thứ trong tuần
                </label>
                <div className="flex gap-2 flex-wrap">
                  {DAY_LABELS.map((label, i) => (
                    <label
                      key={i}
                      className={`px-3 py-1.5 rounded-full text-sm cursor-pointer border transition-colors ${
                        bulkForm.daysOfWeek.includes(i)
                          ? "bg-primary text-white border-primary"
                          : "bg-surface-dark-soft text-muted border-hairline"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={bulkForm.daysOfWeek.includes(i)}
                        onChange={() => toggleBulkDay(i)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <Input
              label="Ghi chú"
              type="text"
              placeholder="VD: Ca chuẩn toàn bộ HLV"
              value={bulkForm.notes}
              onChange={(e) => setBulkForm({ ...bulkForm, notes: e.target.value })}
            />

            {bulkResult && (
              <div className="bg-success/10 border border-success/30 rounded-lg p-3 text-body-sm">
                <p className="text-success font-medium mb-1">
                  ✅ Đã tạo {bulkResult.createdCount} ca làm việc
                </p>
                {bulkResult.skipped.length > 0 && (
                  <div className="text-muted">
                    <p className="mb-1">Bỏ qua {bulkResult.skipped.length} tổ hợp bị trùng/lỗi:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {bulkResult.skipped.map((s, i) => (
                        <li key={i}>
                          {trainerName(s.trainerId)} — {s.reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={bulkSaving}>
                {bulkSaving ? "Đang tạo..." : "Tạo hàng loạt"}
              </Button>
              <Button type="button" variant="secondary" onClick={closeBulkForm}>
                Đóng
              </Button>
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
