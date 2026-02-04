import { ButtonHTMLAttributes } from "react";
import { classNames } from "@/lib/utils";

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "soft" }) {
  return (
    <button
      {...props}
      className={classNames(
        "rounded-full px-4 py-2 text-sm font-semibold transition",
        variant === "primary" && "bg-ink text-white hover:opacity-90",
        variant === "soft" && "bg-slate-100 text-ink hover:bg-slate-200",
        variant === "ghost" && "text-slate-600 hover:text-ink",
        className
      )}
    >
      {children}
    </button>
  );
}
