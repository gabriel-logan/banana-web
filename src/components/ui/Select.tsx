import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string | number; label: string }[];
  error?: string;
  hint?: string;
}

export function Select({ label, options, error, hint, ...props }: SelectProps) {
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
      <select
        className={`w-full rounded-2xl border bg-white/85 px-4 py-3 text-sm text-slate-900 transition outline-none focus:border-[var(--banana-gold)] focus:ring-4 focus:ring-amber-100 ${
          error ? "border-rose-300" : "border-[var(--banana-stroke)]"
        }`}
        id={props.id ?? props.name}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? (
        <span className="block text-sm text-rose-600">{error}</span>
      ) : (
        hint && <span className="block text-xs text-slate-500">{hint}</span>
      )}
    </div>
  );
}
