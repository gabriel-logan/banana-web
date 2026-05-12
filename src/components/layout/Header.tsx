import { FiClock, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router";

import { useLogout } from "../../hooks/useAuth";
import { useAuthStore } from "../../stores/auth.store";
import { Button } from "../ui/Button";

export function Header() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const logout = useLogout();

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
        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-medium text-[var(--banana-ink)]">
                {user?.email}
              </div>
              <div className="text-xs text-slate-500">
                Authenticated session
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
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
