"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { format } from "date-fns";
import { MedicationEntry } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

function filterByDate(data: MedicationEntry[], start?: string, end?: string) {
  return data.filter((entry) => {
    const entryStart = entry.start_date;
    const entryEnd = entry.stop_date ?? entry.end_date ?? entry.start_date;
    if (start && entryEnd < start) return false;
    if (end && entryStart > end) return false;
    return true;
  });
}

function toDate(value: string) {
  return new Date(value + "T00:00:00");
}

export default function MedicationChart({
  data,
  dateRange
}: {
  data: MedicationEntry[];
  dateRange?: { start?: string; end?: string };
}) {
  const filtered = filterByDate(data, dateRange?.start, dateRange?.end);
  if (filtered.length === 0) {
    return <p className="text-sm text-slate-500">Add medications to see trends.</p>;
  }

  const dateSet = new Set<string>();
  filtered.forEach((entry) => {
    dateSet.add(entry.start_date);
    if (entry.stop_date || entry.end_date) {
      dateSet.add(entry.stop_date ?? entry.end_date ?? entry.start_date);
    } else if (dateRange?.end) {
      dateSet.add(dateRange.end);
    }
  });

  const dates = Array.from(dateSet).sort((a, b) => a.localeCompare(b));
  const chartData = dates.map((date) => {
    const count = filtered.filter((entry) => {
      const start = toDate(entry.start_date);
      const stopValue = entry.stop_date ?? entry.end_date ?? null;
      const stop = stopValue ? toDate(stopValue) : null;
      const current = toDate(date);
      if (current < start) return false;
      if (stop && current > stop) return false;
      return true;
    }).length;
    return { date, count };
  });

  const values = chartData.map((row) => row.count);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = min === max ? 1 : (max - min) * 0.1;

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => format(new Date(value), "MMM d")}
            fontSize={12}
          />
          <YAxis domain={[min - padding, max + padding]} allowDecimals={false} fontSize={12} />
          <Tooltip
            formatter={(value: number) => [`${formatNumber(value)}`, "Active meds"]}
            labelFormatter={(value) => format(new Date(value), "MMM d, yyyy")}
          />
          <Line type="monotone" dataKey="count" stroke="#2C7BE5" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
