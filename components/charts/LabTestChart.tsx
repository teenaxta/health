"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  ReferenceArea,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { format } from "date-fns";
import { LabTestEntry } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

function filterByDate(data: LabTestEntry[], start?: string, end?: string) {
  return data.filter((entry) => {
    if (start && entry.entry_date < start) return false;
    if (end && entry.entry_date > end) return false;
    return true;
  });
}

export default function LabTestChart({
  data,
  testName,
  dateRange
}: {
  data: LabTestEntry[];
  testName: string;
  dateRange?: { start?: string; end?: string };
}) {
  const filtered = filterByDate(
    data.filter((entry) => entry.test_name === testName),
    dateRange?.start,
    dateRange?.end
  ).sort((a, b) => a.entry_date.localeCompare(b.entry_date));

  const numeric = filtered.filter((entry) => typeof entry.value === "number");

  if (numeric.length === 0) {
    return <p className="text-sm text-slate-500">No numeric entries for this test yet.</p>;
  }

  const dateCounts = new Map<string, number>();
  const chartData = numeric.map((entry) => {
    const base = new Date(entry.entry_date + "T00:00:00").getTime();
    const count = dateCounts.get(entry.entry_date) ?? 0;
    dateCounts.set(entry.entry_date, count + 1);
    return {
      ts: base + count * 60 * 60 * 1000,
      date: entry.entry_date,
      value: entry.value,
      lab: entry.lab_name ?? ""
    };
  });

  const values = chartData.map((entry) => entry.value as number);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = min === max ? 1 : (max - min) * 0.1;

  const latestWithRange = [...numeric].reverse().find((entry) => entry.ref_low || entry.ref_high);
  const tickDates = Array.from(new Set(chartData.map((entry) => entry.date))).map((date) =>
    new Date(date + "T00:00:00").getTime()
  );

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="ts"
            type="number"
            domain={["dataMin", "dataMax"]}
            ticks={tickDates}
            tickFormatter={(value) => format(new Date(value), "MMM d")}
            fontSize={12}
          />
          <YAxis
            domain={[min - padding, max + padding]}
            fontSize={12}
            tickFormatter={(value) => formatNumber(value)}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;
              const point = payload[0].payload as { ts: number; lab?: string; value: number };
              return (
                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-soft">
                  <div className="font-semibold text-ink">
                    {format(new Date(point.ts), "MMM d, yyyy")}
                  </div>
                  <div className="text-slate-500">Lab: {point.lab || "—"}</div>
                  <div className="text-slate-700">Value: {formatNumber(point.value)}</div>
                </div>
              );
            }}
          />
          {latestWithRange &&
            latestWithRange.ref_low !== null &&
            latestWithRange.ref_high !== null && (
            <ReferenceArea
              y1={latestWithRange.ref_low ?? undefined}
              y2={latestWithRange.ref_high ?? undefined}
              fill="#40C9A2"
              fillOpacity={0.12}
            />
          )}
          <Line type="monotone" dataKey="value" stroke="#6D5DF6" strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
