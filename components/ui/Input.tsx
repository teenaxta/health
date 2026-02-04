import { InputHTMLAttributes } from "react";
import { classNames } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={classNames(
        "w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-ink shadow-sm focus:border-ink focus:outline-none",
        className
      )}
    />
  );
}
