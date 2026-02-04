"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/weights", label: "Weight" },
  { href: "/tests", label: "Lab Tests" },
  { href: "/procedures", label: "Procedures" },
  { href: "/medications", label: "Medications" },
  { href: "/visits", label: "Visits & Prescriptions" },
  { href: "/symptoms", label: "Symptoms" },
  { href: "/timeline", label: "Timeline" },
  { href: "/import-export", label: "Import/Export" }
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden lg:flex w-72 flex-col gap-6 bg-white/70 backdrop-blur border-r border-slate-200 px-6 py-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Health Hub</p>
          <h1 className="text-2xl font-semibold text-ink">My Health Platform</h1>
        </div>
        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-2xl px-4 py-3 text-sm font-medium transition",
                  active
                    ? "bg-ink text-white shadow-soft"
                    : "text-slate-600 hover:text-ink hover:bg-slate-100"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl bg-ink/95 text-white p-4">
          <p className="text-sm font-semibold">Quick Tip</p>
          <p className="text-xs text-slate-200">
            Keep entries consistent by using the same units.
          </p>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white/70 backdrop-blur px-6 py-4 lg:px-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Health Hub</p>
            <h2 className="text-lg font-semibold text-ink">Personal Health Console</h2>
          </div>
          <div className="flex gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1">Local Dev</span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">Supabase</span>
          </div>
        </header>

        <nav className="lg:hidden border-b border-slate-200 bg-white/70 px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold",
                    active ? "bg-ink text-white" : "bg-slate-100 text-slate-600"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <main className="px-6 py-8 lg:px-12">{children}</main>
      </div>
    </div>
  );
}
