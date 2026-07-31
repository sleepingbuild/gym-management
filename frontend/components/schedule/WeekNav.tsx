"use client";

import { formatWeekRangeLabel, getMondayUTC, addDaysUTC, todayUTC } from "@/lib/calendarDate";

interface WeekNavProps {
  weekStart: Date;
  onChange: (newWeekStart: Date) => void;
}

export default function WeekNav({ weekStart, onChange }: WeekNavProps) {
  const isCurrentWeek = weekStart.getTime() === getMondayUTC(todayUTC()).getTime();

  return (
    <div className="flex items-center gap-3 flex-wrap justify-between">
      <p className="text-sm text-ink font-medium">
        <span className="text-muted mr-1.5">Tuần:</span>
        {formatWeekRangeLabel(weekStart)}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(addDaysUTC(weekStart, -7))}
          className="px-3 py-1.5 text-sm bg-surface-dark-elevated text-ink rounded-md hover:bg-hairline transition-colors"
        >
          ‹ Tuần trước
        </button>
        <button
          type="button"
          onClick={() => onChange(getMondayUTC(todayUTC()))}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            isCurrentWeek
              ? "bg-accent-orange/15 text-accent-orange border border-accent-orange/40"
              : "bg-surface-dark-elevated text-ink hover:bg-hairline"
          }`}
        >
          Hôm nay
        </button>
        <button
          type="button"
          onClick={() => onChange(addDaysUTC(weekStart, 7))}
          className="px-3 py-1.5 text-sm bg-surface-dark-elevated text-ink rounded-md hover:bg-hairline transition-colors"
        >
          Tuần sau ›
        </button>
      </div>
    </div>
  );
}