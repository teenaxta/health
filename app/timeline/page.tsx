"use client";

import { useQuery } from "@tanstack/react-query";
import { listTimeline } from "@/lib/api/timeline";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

const tones: Record<string, "info" | "success" | "warning" | "neutral"> = {
  weight: "info",
  lab_test: "warning",
  medication: "neutral",
  diagnosis: "warning",
  visit: "info",
  symptom: "success"
};

export default function TimelinePage() {
  const { data = [] } = useQuery({ queryKey: ["timeline"], queryFn: listTimeline });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Timeline" subtitle="A unified feed of your health history." />

      <Card title="Chronological Log" subtitle="Sorted by date">
        <div className="space-y-4">
          {data.map((event) => (
            <div
              key={`${event.category}-${event.id}`}
              className="rounded-2xl border border-slate-100 bg-white/70 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-ink">{event.title}</p>
                  <p className="text-xs text-slate-500">{event.subtitle}</p>
                </div>
                <div className="text-right">
                  <Badge tone={tones[event.category] ?? "neutral"}>{event.category}</Badge>
                  <p className="mt-1 text-xs text-slate-400">{formatDate(event.entry_date)}</p>
                </div>
              </div>
              {event.notes && <p className="mt-2 text-sm text-slate-500">{event.notes}</p>}
            </div>
          ))}
          {data.length === 0 && (
            <p className="text-sm text-slate-500">No timeline events yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
