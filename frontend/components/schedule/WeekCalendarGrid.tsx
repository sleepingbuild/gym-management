"use client";

import { useMemo } from "react";
import { formatUTCDateShort, isSameUTCDate, todayUTC } from "@/lib/calendarDate";

export interface CalendarEvent {
  id: string;
  dayIndex: number; // 0 = Thứ 2 ... 6 = Chủ nhật
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  title: string;
  subtitle?: string;
  colorClass?: string; // class Tailwind cho nền + chữ
  onClick?: () => void;
}

interface WeekCalendarGridProps {
  /** Đúng 7 ngày, thứ tự Thứ 2 -> Chủ nhật. */
  days: Date[];
  events: CalendarEvent[];
  startHour?: number;
  endHour?: number;
  /** Nếu truyền vào, click ô trống sẽ gọi hàm này với (dayIndex, hour). */
  onSlotClick?: (dayIndex: number, hour: number) => void;
  cellHeight?: number;
  /** Các cột (dayIndex) bị làm mờ, không cho click (vd: ngày đã qua). */
  disabledDayIndexes?: number[];
  maxHeight?: number;
}

const DAY_LABELS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

interface PlacedEvent extends CalendarEvent {
  col: number;
  totalCols: number;
}

/** Xếp các sự kiện trùng giờ trong 1 ngày cạnh nhau (giống Google Calendar). */
function layoutDayEvents(events: CalendarEvent[]): PlacedEvent[] {
  const sorted = [...events].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
  );
  const columnEndTimes: number[] = [];
  const placed: { event: CalendarEvent; col: number }[] = [];

  sorted.forEach((e) => {
    const start = timeToMinutes(e.startTime);
    const end = timeToMinutes(e.endTime);
    let colIndex = columnEndTimes.findIndex((endTime) => endTime <= start);
    if (colIndex === -1) {
      colIndex = columnEndTimes.length;
      columnEndTimes.push(end);
    } else {
      columnEndTimes[colIndex] = end;
    }
    placed.push({ event: e, col: colIndex });
  });

  const totalCols = Math.max(columnEndTimes.length, 1);
  return placed.map(({ event, col }) => ({ ...event, col, totalCols }));
}

export default function WeekCalendarGrid({
  days,
  events,
  startHour = 6,
  endHour = 21,
  onSlotClick,
  cellHeight = 56,
  disabledDayIndexes = [],
  maxHeight = 600,
}: WeekCalendarGridProps) {
  const hours = useMemo(
    () => Array.from({ length: endHour - startHour }, (_, i) => startHour + i),
    [startHour, endHour],
  );
  const today = useMemo(() => todayUTC(), []);

  const placedByDay = useMemo(() => {
    const map: Record<number, PlacedEvent[]> = {};
    for (let i = 0; i < 7; i++) {
      const dayEvents = events.filter((e) => e.dayIndex === i);
      map[i] = layoutDayEvents(dayEvents);
    }
    return map;
  }, [events]);

  const totalHeight = hours.length * cellHeight;

  return (
    <div className="bg-surface-card border border-hairline rounded-lg overflow-hidden">
      {/* Header ngày */}
      <div className="grid grid-cols-[52px_repeat(7,1fr)] border-b border-hairline">
        <div />
        {days.map((d, i) => {
          const isToday = isSameUTCDate(d, today);
          const isDisabled = disabledDayIndexes.includes(i);
          return (
            <div
              key={i}
              className={`px-1 py-2.5 text-center border-l border-hairline ${
                isToday ? "bg-accent-teal/10" : ""
              } ${isDisabled ? "opacity-50" : ""}`}
            >
              <p
                className={`text-[11px] font-semibold uppercase ${
                  isToday ? "text-accent-teal" : "text-muted"
                }`}
              >
                {DAY_LABELS[i]}
              </p>
              <p className={`text-sm font-medium ${isToday ? "text-accent-teal" : "text-ink"}`}>
                {formatUTCDateShort(d)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Thân lưới */}
      <div
        className="grid grid-cols-[52px_repeat(7,1fr)] overflow-y-auto"
        style={{ maxHeight }}
      >
        <div className="relative" style={{ height: totalHeight }}>
          {hours.map((h, i) => (
            <div
              key={h}
              className="absolute left-0 right-0 text-right pr-1.5 text-[11px] text-muted -translate-y-1/2"
              style={{ top: i * cellHeight }}
            >
              {String(h).padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {days.map((d, dayIndex) => {
          const isDisabled = disabledDayIndexes.includes(dayIndex);
          const clickable = !!onSlotClick && !isDisabled;
          return (
            <div
              key={dayIndex}
              className={`relative border-l border-hairline ${isDisabled ? "bg-surface-dark/40" : ""}`}
              style={{ height: totalHeight }}
            >
              {hours.map((h, i) => (
                <button
                  type="button"
                  key={h}
                  onClick={() => clickable && onSlotClick?.(dayIndex, h)}
                  disabled={!clickable}
                  className={`absolute left-0 right-0 border-t border-hairline/60 ${
                    clickable ? "hover:bg-surface-dark-elevated/60 cursor-pointer" : "cursor-default"
                  }`}
                  style={{ top: i * cellHeight, height: cellHeight }}
                />
              ))}

              {(placedByDay[dayIndex] ?? []).map((e) => {
                const startMin = timeToMinutes(e.startTime) - startHour * 60;
                const endMin = timeToMinutes(e.endTime) - startHour * 60;
                const top = (startMin / 60) * cellHeight;
                const height = Math.max(((endMin - startMin) / 60) * cellHeight, 22);
                const widthPct = 100 / e.totalCols;
                const leftPct = e.col * widthPct;
                return (
                  <div
                    key={e.id}
                    onClick={() => e.onClick?.()}
                    className={`absolute rounded-md px-1.5 py-1 overflow-hidden text-left z-10 ${
                      e.colorClass ?? "bg-accent-orange text-white"
                    } ${e.onClick ? "cursor-pointer hover:opacity-90" : ""}`}
                    style={{
                      top,
                      height,
                      left: `calc(${leftPct}% + 2px)`,
                      width: `calc(${widthPct}% - 4px)`,
                    }}
                  >
                    <p className="text-[11px] font-semibold truncate">{e.title}</p>
                    <p className="text-[10px] opacity-90 truncate">
                      {e.startTime}–{e.endTime}
                    </p>
                    {e.subtitle && (
                      <p className="text-[10px] opacity-80 truncate">{e.subtitle}</p>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
