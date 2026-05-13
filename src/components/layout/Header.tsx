import { useTranslation } from "react-i18next";
import { FiClock, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router";

import { useLogout } from "../../hooks/useAuth";
import { useAuthStore } from "../../stores/auth.store";
import { useUserStore } from "../../stores/userStore";
import type { Locale } from "../../types/locales.types";
import { Button } from "../ui/Button";

export function Header() {
  const { t, i18n } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const locale = useUserStore((s) => s.locale);
  const setLocale = useUserStore((s) => s.setLocale);
  const navigate = useNavigate();
  const logout = useLogout();

  function changeLocale(nextLocale: Locale) {
    setLocale(nextLocale);
    void i18n.changeLanguage(nextLocale);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/50 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-start justify-between gap-3 px-4 py-3 sm:flex-nowrap sm:items-center sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
        <button
          className="flex min-w-0 items-center gap-3 text-left"
          onClick={() => navigate(isAuthenticated ? "/reservations" : "/login")}
          type="button"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--banana-gold)] text-[var(--banana-ink)] shadow-[0_16px_35px_rgba(247,201,72,0.35)]">
            <FiClock className="text-xl" />
          </div>
          <div className="min-w-0">
            <div className="hidden text-xs font-semibold tracking-[0.25em] text-[var(--banana-leaf)] uppercase sm:block">
              Banana Ltda.
            </div>
            <div className="truncate text-base font-semibold text-[var(--banana-ink)] sm:text-lg">
              Meeting Rooms
            </div>
          </div>
        </button>
        <div className="flex w-full items-center justify-end gap-2 sm:w-auto sm:gap-3">
          <div className="flex items-center rounded-full border border-[var(--banana-stroke)] bg-white/80 p-1 shadow-[0_12px_30px_rgba(148,163,184,0.12)]">
            {(["en", "pt"] as const).map((language) => {
              const isActive = locale === language;

              return (
                <button
                  key={language}
                  className={`rounded-full px-2.5 py-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase transition sm:px-3 sm:text-xs ${
                    isActive
                      ? "bg-[var(--banana-gold)] text-[var(--banana-ink)] shadow-[0_10px_24px_rgba(247,201,72,0.35)]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  onClick={() => changeLocale(language)}
                  type="button"
                >
                  {language}
                </button>
              );
            })}
          </div>
          {isAuthenticated && (
            <>
              <div className="hidden text-right sm:block">
                <div className="text-sm font-medium text-[var(--banana-ink)]">
                  {user?.email}
                </div>
                <div className="text-xs text-slate-500">
                  {t("Authenticated session")}
                </div>
              </div>
              <Button
                className="shrink-0"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                type="button"
                variant="ghost"
              >
                <FiLogOut />
                <span className="hidden sm:inline">{t("Sign out")}</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
