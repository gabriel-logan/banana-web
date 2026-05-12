import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[var(--banana-ink)] text-white shadow-[0_16px_35px_rgba(31,41,55,0.18)] hover:-translate-y-0.5 hover:bg-slate-800",
  secondary:
    "bg-[var(--banana-gold)] text-[var(--banana-ink)] shadow-[0_16px_35px_rgba(247,201,72,0.3)] hover:-translate-y-0.5 hover:bg-[var(--banana-amber)]",
  ghost:
    "border border-[var(--banana-stroke)] bg-white/80 text-[var(--banana-ink)] hover:bg-white",
  danger:
    "bg-rose-600 text-white shadow-[0_16px_35px_rgba(225,29,72,0.22)] hover:-translate-y-0.5 hover:bg-rose-700",
};

export function Button({
  children,
  className = "",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
