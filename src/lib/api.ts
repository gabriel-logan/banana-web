import axios from "axios";

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

reservationsHttp.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (payload: LoginRequest) =>
    authHttp.post<AuthResponse>("/api/auth/login", payload).then((r) => r.data),

  register: (payload: RegisterRequest) =>
    authHttp
      .post<AuthResponse>("/api/auth/register", payload)
      .then((r) => r.data),
};

export const branchesApi = {
  getAll: () => reservationsHttp.get<Branch[]>("/branches").then((r) => r.data),
};

export const roomsApi = {
  getAll: () => reservationsHttp.get<Room[]>("/rooms").then((r) => r.data),
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
