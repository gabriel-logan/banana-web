import { useTranslation } from "react-i18next";
import { FiHome } from "react-icons/fi";
import { useNavigate } from "react-router";

import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="max-w-xl rounded-[32px] border border-white/60 bg-white/85 p-8 text-center shadow-[0_30px_80px_rgba(15,23,42,0.12)] sm:p-10">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-3xl font-semibold text-[var(--banana-amber)]">
          404
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">
          {t("Page not found")}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
          {t(
            "The page you requested does not exist or is no longer available.",
          )}
        </p>
        <div className="mt-8 flex justify-center">
          <Button onClick={() => navigate("/")} variant="secondary">
            <FiHome />
            {t("Go home")}
          </Button>
        </div>
      </div>
    </div>
  );
}
