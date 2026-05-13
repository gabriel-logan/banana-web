import { useEffect } from "react";

import { SESSION_REFRESH_BUFFER_MS } from "../../constants";
import { refreshAuthSession } from "../../lib/api";
import { useAuthStore } from "../../stores/auth.store";

export function SessionManager() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const expiresAt = useAuthStore((state) => state.expiresAt);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  useEffect(() => {
    if (!isAuthenticated || !expiresAt || !refreshToken) {
      return;
    }

    const refreshDelay = Math.max(
      expiresAt - Date.now() - SESSION_REFRESH_BUFFER_MS,
      0,
    );

    const timeoutId = window.setTimeout(() => {
      void refreshAuthSession();
    }, refreshDelay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [expiresAt, isAuthenticated, refreshToken]);

  return null;
}
