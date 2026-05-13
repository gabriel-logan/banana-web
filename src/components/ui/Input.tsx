import type { InputHTMLAttributes } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, ...props }: InputProps) {
  const { t } = useTranslation();
  const isPasswordField = props.type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const inputType =
    isPasswordField && showPassword ? "text" : (props.type ?? "text");

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
      <div className="relative">
        <input
          className={`w-full rounded-2xl border bg-white/85 px-4 py-3 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-[var(--banana-gold)] focus:ring-4 focus:ring-amber-100 ${
            error ? "border-rose-300" : "border-[var(--banana-stroke)]"
          } ${isPasswordField ? "pr-12" : ""}`}
          id={props.id ?? props.name}
          {...props}
          type={inputType}
        />
        {isPasswordField && (
          <button
            aria-label={showPassword ? t("Hide password") : t("Show password")}
            className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition hover:text-slate-800"
            onClick={() => setShowPassword((current) => !current)}
            tabIndex={-1}
            type="button"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
      {error ? (
        <span className="block text-sm text-rose-600">{error}</span>
      ) : (
        hint && <span className="block text-xs text-slate-500">{hint}</span>
      )}
    </div>
  );
}
