"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isWithinInterval,
  startOfMonth,
  subMonths
} from "date-fns";

export function DateRangeFilter({
  start,
  end,
  onChange
}: {
  start?: string;
  end?: string;
  onChange: (range: { start?: string; end?: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draftStart, setDraftStart] = useState<Date | null>(null);
  const [draftEnd, setDraftEnd] = useState<Date | null>(null);
  const [month, setMonth] = useState<Date>(() => new Date());

  useEffect(() => {
    if (open) {
      const startDate = start ? new Date(start) : null;
      const endDate = end ? new Date(end) : null;
      setDraftStart(startDate);
      setDraftEnd(endDate);
      setMonth(startDate ?? new Date());
    }
  }, [open, start, end]);

  const label = useMemo(() => {
    if (start && end) {
      return `${format(new Date(start), "MMM d, yyyy")} — ${format(
        new Date(end),
        "MMM d, yyyy"
      )}`;
    }
    if (start) {
      return format(new Date(start), "MMM d, yyyy");
    }
    return "Select date range";
  }, [start, end]);

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const startWeekday = getDay(monthStart);
  const daysInMonth = Array.from({ length: monthEnd.getDate() }, (_, i) =>
    addDays(monthStart, i)
  );

  function handleDaySelect(day: Date) {
    if (!draftStart || (draftStart && draftEnd)) {
      setDraftStart(day);
      setDraftEnd(null);
      return;
    }
    if (draftStart && !draftEnd) {
      if (day < draftStart) {
        setDraftEnd(draftStart);
        setDraftStart(day);
      } else {
        setDraftEnd(day);
      }
    }
  }

  function handleApply() {
    onChange({
      start: draftStart ? format(draftStart, "yyyy-MM-dd") : undefined,
      end: draftEnd ? format(draftEnd, "yyyy-MM-dd") : undefined
    });
    setOpen(false);
  }

  function handleClear() {
    setDraftStart(null);
    setDraftEnd(null);
    onChange({ start: undefined, end: undefined });
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-ink shadow-sm hover:border-slate-300"
      >
        <span>{label}</span>
        <span className="text-slate-400">▾</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-72 rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="flex items-center justify-between pb-3">
            <button
              type="button"
              onClick={() => setMonth((prev) => subMonths(prev, 1))}
              className="rounded-full px-2 py-1 text-slate-500 hover:bg-slate-100"
            >
              ‹
            </button>
            <div className="text-sm font-semibold text-ink">
              {format(month, "MMMM yyyy")}
            </div>
            <button
              type="button"
              onClick={() => setMonth((prev) => addMonths(prev, 1))}
              className="rounded-full px-2 py-1 text-slate-500 hover:bg-slate-100"
            >
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400">
            {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1 text-center text-sm">
            {Array.from({ length: startWeekday }).map((_, idx) => (
              <div key={`blank-${idx}`} className="py-2" />
            ))}
            {daysInMonth.map((day) => {
              const isStart = draftStart && isSameDay(day, draftStart);
              const isEnd = draftEnd && isSameDay(day, draftEnd);
              const inRange =
                draftStart &&
                draftEnd &&
                isWithinInterval(day, { start: draftStart, end: draftEnd });
              return (
                <button
                  type="button"
                  key={day.toISOString()}
                  onClick={() => handleDaySelect(day)}
                  className={[
                    "h-9 w-9 rounded-full transition",
                    inRange ? "bg-emerald-100 text-emerald-900" : "",
                    isStart || isEnd ? "bg-emerald-500 text-white" : "",
                    !inRange && !isStart && !isEnd ? "hover:bg-slate-100" : ""
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
