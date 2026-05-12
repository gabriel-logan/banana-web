import { reservationsApi } from "../lib/api";
import type {
  CreateReservationRequest,
  Reservation,
  UpdateReservationRequest,
} from "../types/reservation.types";

export async function fetchReservations(): Promise<Reservation[]> {
  return reservationsApi.getAll();
}

export async function fetchReservationById(id: string): Promise<Reservation> {
  return reservationsApi.getById(id);
}

export async function createReservationAction(
  payload: CreateReservationRequest,
): Promise<Reservation> {
  return reservationsApi.create(payload);
}

export async function updateReservationAction(
  id: number,
  payload: UpdateReservationRequest,
): Promise<Reservation> {
  return reservationsApi.update(id, payload);
}

export async function deleteReservationAction(id: number): Promise<void> {
  return reservationsApi.remove(id);
}
