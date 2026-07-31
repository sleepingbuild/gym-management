// Các hàm xử lý ngày dùng chung cho các trang lịch dạng lưới tuần
// (Admin / PT / Member).
//
// Toàn bộ tính theo mốc UTC-midnight để khớp với cách backend lưu các
// trường "date-only" (Booking.date, TrainerSchedule.specificDate) — vốn
// được tạo từ chuỗi "YYYY-MM-DD" nên luôn là UTC 00:00. Nếu trộn lẫn
// Date theo local time sẽ dễ bị lệch ngày như bug khung giờ trước đó.

/** "Hôm nay" theo lịch của người dùng, chuẩn hoá về UTC-midnight. */
export function todayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

/** Thứ 2 (UTC-midnight) của tuần chứa ngày truyền vào. */
export function getMondayUTC(date: Date): Date {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const day = d.getUTCDay(); // 0=CN..6=T7
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
}

export function addDaysUTC(date: Date, days: number): Date {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

export function isSameUTCDate(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

export function formatUTCDateShort(d: Date): string {
  return `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function formatWeekRangeLabel(weekStart: Date): string {
  const end = addDaysUTC(weekStart, 6);
  return `${formatUTCDateShort(weekStart)} – ${formatUTCDateShort(end)}/${end.getUTCFullYear()}`;
}

/** Chuỗi "YYYY-MM-DD" để gửi lên API, khớp cách input[type=date] sinh ra. */
export function toISODateUTC(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

/** DB dùng quy ước JS Date: dayOfWeek 0=Chủ nhật..6=Thứ 7. */
export function jsDayToGridIndex(jsDay: number): number {
  return jsDay === 0 ? 6 : jsDay - 1;
}

export function gridIndexToJsDay(gridIndex: number): number {
  return gridIndex === 6 ? 0 : gridIndex + 1;
}

export function buildWeekDates(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDaysUTC(weekStart, i));
}