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
import { WeightEntry } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

function filterByDate(data: WeightEntry[], start?: string, end?: string) {
  return data.filter((entry) => {
    if (start && entry.entry_date < start) return false;
    if (end && entry.entry_date > end) return false;
    return true;
  });
}

export default function WeightChart({
  data,
  dateRange
}: {
  data: WeightEntry[];
  dateRange?: { start?: string; end?: string };
}) {
  const filtered = filterByDate(data, dateRange?.start, dateRange?.end);
  const grouped = new Map<string, number[]>();

  filtered.forEach((entry) => {
    const key = entry.entry_date;
    if (typeof entry.value !== "number" || Number.isNaN(entry.value)) {
      return;
    }
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(entry.value);
  });

  const chartData = Array.from(grouped.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, values]) => ({
      date,
      avg: values.reduce((sum, val) => sum + val, 0) / values.length
    }));

  const allValues = chartData.map((row) => row.avg);

  if (chartData.length === 0) {
    return <p className="text-sm text-slate-500">Add weight entries to see trends.</p>;
  }

  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
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
          <YAxis
            domain={[min - padding, max + padding]}
            fontSize={12}
            tickFormatter={(value) => formatNumber(value)}
          />
          <Tooltip
            formatter={(value: number) => [`${formatNumber(value)}`, ""]}
            labelFormatter={(value) => format(new Date(value), "MMM d, yyyy")}
          />
          <Line type="monotone" dataKey="avg" name="Avg Weight" stroke="#2C7BE5" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
