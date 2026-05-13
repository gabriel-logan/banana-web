export const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL as string;
export const RESERVATIONS_API_URL = import.meta.env
  .VITE_RESERVATIONS_API_URL as string;

const DEFAULT_SESSION_TTL_MINUTES = 15;
const parsedSessionTtlMinutes = Number(
  import.meta.env.VITE_SESSION_TTL_MINUTES ?? DEFAULT_SESSION_TTL_MINUTES,
);

export const SESSION_TTL_MINUTES =
  Number.isFinite(parsedSessionTtlMinutes) && parsedSessionTtlMinutes > 0
    ? parsedSessionTtlMinutes
    : DEFAULT_SESSION_TTL_MINUTES;

export const SESSION_TTL_MS = SESSION_TTL_MINUTES * 60 * 1000;
export const SESSION_REFRESH_BUFFER_MS = 5_000;
