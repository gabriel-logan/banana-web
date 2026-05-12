import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          className="block text-sm font-semibold text-slate-700"
          htmlFor={props.id ?? props.name}
        >
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-2xl border bg-white/85 px-4 py-3 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-[var(--banana-gold)] focus:ring-4 focus:ring-amber-100 ${
          error ? "border-rose-300" : "border-[var(--banana-stroke)]"
        }`}
        id={props.id ?? props.name}
        {...props}
      />
      {error ? (
        <span className="block text-sm text-rose-600">{error}</span>
      ) : (
        hint && <span className="block text-xs text-slate-500">{hint}</span>
      )}
    </div>
  );
}
