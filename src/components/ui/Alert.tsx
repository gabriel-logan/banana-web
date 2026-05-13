import type { ReactNode } from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo } from "react-icons/fi";

interface AlertProps {
  children: ReactNode;
  title?: string;
  variant?: "error" | "info" | "success";
}

const styles: Record<NonNullable<AlertProps["variant"]>, string> = {
  error: "border-rose-200 bg-rose-50 text-rose-700",
  info: "border-sky-200 bg-sky-50 text-sky-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const icons: Record<NonNullable<AlertProps["variant"]>, ReactNode> = {
  error: <FiAlertCircle className="mt-0.5 shrink-0 text-lg" />,
  info: <FiInfo className="mt-0.5 shrink-0 text-lg" />,
  success: <FiCheckCircle className="mt-0.5 shrink-0 text-lg" />,
};

export function Alert({ children, title, variant = "error" }: AlertProps) {
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${styles[variant]}`}>
      <div className="flex items-start gap-3">
        {icons[variant]}
        <div className="space-y-1">
          {title && <p className="font-semibold">{title}</p>}
          <div className="leading-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
