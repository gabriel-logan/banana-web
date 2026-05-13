import { create } from "zustand";

import { SESSION_TTL_MS } from "../constants";
import type { AuthResponse, StoredSession, User } from "../types/auth.types";

const STORAGE_KEY = "banana-web.auth.session";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  user: User | null;
  isAuthenticated: boolean;
  setSession: (session: AuthResponse) => void;
  logout: () => void;
}

function saveSession(session: StoredSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

function readStoredSession(): StoredSession | null {
  const rawSession = localStorage.getItem(STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(rawSession) as Partial<StoredSession>;

    if (
      typeof parsedSession.accessToken !== "string" ||
      typeof parsedSession.refreshToken !== "string" ||
      typeof parsedSession.expiresAt !== "number" ||
      !parsedSession.user
    ) {
      clearSession();
      return null;
    }

    return parsedSession as StoredSession;
  } catch {
    clearSession();
    return null;
  }
}

function toAuthenticatedState(session: StoredSession) {
  return {
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    expiresAt: session.expiresAt,
    user: session.user,
    isAuthenticated: true,
  };
}

function getInitialState() {
  const storedSession = readStoredSession();

  if (!storedSession) {
    return {
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      user: null,
      isAuthenticated: false,
    };
  }

  return toAuthenticatedState(storedSession);
}

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),

  setSession: (session: AuthResponse) => {
    const nextSession: StoredSession = {
      ...session,
      expiresAt: Date.now() + SESSION_TTL_MS,
    };

    saveSession(nextSession);
    set(toAuthenticatedState(nextSession));
  },

  logout: () => {
    clearSession();
    set({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
