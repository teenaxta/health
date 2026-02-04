import { ReactNode } from "react";

export function StatCard({
  label,
  value,
  helper,
  icon
}: {
  label: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white/80 p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
        {icon}
      </div>
      <p className="mt-3 text-2xl font-semibold text-ink">{value}</p>
      {helper && <p className="text-xs text-slate-500 mt-1">{helper}</p>}
    </div>
  );
}
