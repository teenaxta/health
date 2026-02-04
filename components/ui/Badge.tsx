import { ReactNode } from "react";
import { classNames } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral"
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "info" | "danger";
}) {
  return (
    <span
      className={classNames(
        "rounded-full px-3 py-1 text-xs font-semibold",
        tone === "neutral" && "bg-slate-100 text-slate-600",
        tone === "success" && "bg-emerald-100 text-emerald-700",
        tone === "warning" && "bg-amber-100 text-amber-700",
        tone === "info" && "bg-sky-100 text-sky-700",
        tone === "danger" && "bg-rose-100 text-rose-700"
      )}
    >
      {children}
    </span>
  );
}
