import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { AUTH_API_URL, RESERVATIONS_API_URL } from "../constants";
import { useAuthStore } from "../stores/auth.store";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth.types";
import type { Branch } from "../types/branch.types";
import type {
  CreateReservationRequest,
  Reservation,
  UpdateReservationRequest,
} from "../types/reservation.types";
import type { Room } from "../types/room.types";

const authHttp = axios.create({ baseURL: AUTH_API_URL });
const reservationsHttp = axios.create({ baseURL: RESERVATIONS_API_URL });

let refreshPromise: Promise<string | null> | null = null;

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

function isSessionExpired(expiresAt: number | null) {
  return expiresAt === null || Date.now() >= expiresAt;
}

export async function refreshAuthSession(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  const { refreshToken, logout, setSession } = useAuthStore.getState();

  if (!refreshToken) {
    logout();
    return null;
  }

  refreshPromise = authHttp
    .post<AuthResponse>("/auth/refresh", { refreshToken })
    .then((response) => {
      setSession(response.data);
      return response.data.accessToken;
    })
    .catch(() => {
      logout();
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

reservationsHttp.interceptors.request.use(async (config) => {
  const { accessToken, expiresAt, refreshToken } = useAuthStore.getState();

  if (!accessToken || !refreshToken) {
    return config;
  }

  let nextAccessToken = accessToken;

  if (isSessionExpired(expiresAt)) {
    const refreshedAccessToken = await refreshAuthSession();

    if (!refreshedAccessToken) {
      return config;
    }

    nextAccessToken = refreshedAccessToken;
  }

  config.headers.Authorization = `Bearer ${nextAccessToken}`;

  return config;
});

reservationsHttp.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableRequestConfig | undefined;

    if (error.response?.status !== 401 || !config || config._retry) {
      throw error;
    }

    const refreshedAccessToken = await refreshAuthSession();

    if (!refreshedAccessToken) {
      throw error;
    }

    config._retry = true;
    config.headers.Authorization = `Bearer ${refreshedAccessToken}`;

    return reservationsHttp(config);
  },
);

export const authApi = {
  login: (payload: LoginRequest) =>
    authHttp.post<AuthResponse>("/auth/login", payload).then((r) => r.data),

  register: (payload: RegisterRequest) =>
    authHttp.post<AuthResponse>("/auth/register", payload).then((r) => r.data),
};

export const branchesApi = {
  getAll: () => reservationsHttp.get<Branch[]>("/branches").then((r) => r.data),
};

export const roomsApi = {
  getAll: (branchId?: number) =>
    reservationsHttp
      .get<Room[]>("/rooms", {
        params: branchId ? { branch_id: branchId } : undefined,
      })
      .then((r) => r.data),
};

export const reservationsApi = {
  getAll: () =>
    reservationsHttp.get<Reservation[]>("/reservations").then((r) => r.data),

  getById: (id: string) =>
    reservationsHttp
      .get<Reservation>(`/reservations/${id}`)
      .then((r) => r.data),

  create: (payload: CreateReservationRequest) =>
    reservationsHttp
      .post<Reservation>("/reservations", payload)
      .then((r) => r.data),

  update: (id: number, payload: UpdateReservationRequest) =>
    reservationsHttp
      .put<Reservation>(`/reservations/${id}`, payload)
      .then((r) => r.data),

  remove: (id: number) =>
    reservationsHttp.delete(`/reservations/${id}`).then(() => undefined),
};
