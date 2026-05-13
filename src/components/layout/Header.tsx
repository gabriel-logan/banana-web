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
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <button
          className="flex items-center gap-3 text-left"
          onClick={() => navigate(isAuthenticated ? "/reservations" : "/login")}
          type="button"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--banana-gold)] text-[var(--banana-ink)] shadow-[0_16px_35px_rgba(247,201,72,0.35)]">
            <FiClock className="text-xl" />
          </div>
          <div>
            <div className="text-xs font-semibold tracking-[0.25em] text-[var(--banana-leaf)] uppercase">
              Banana Ltda.
            </div>
            <div className="text-lg font-semibold text-[var(--banana-ink)]">
              Meeting Rooms
            </div>
          </div>
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-[var(--banana-stroke)] bg-white/80 p-1 shadow-[0_12px_30px_rgba(148,163,184,0.12)]">
            {(["en", "pt"] as const).map((language) => {
              const isActive = locale === language;

              return (
                <button
                  key={language}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase transition ${
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
