import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { reservationsApi } from "../lib/api";
import type {
  CreateReservationRequest,
  UpdateReservationRequest,
} from "../types/reservation.types";

const RESERVATIONS_KEY = "reservations";

export function useReservations() {
  return useQuery({
    queryKey: [RESERVATIONS_KEY],
    queryFn: reservationsApi.getAll,
  });
}

export function useReservation(id: string) {
  return useQuery({
    queryKey: [RESERVATIONS_KEY, id],
    queryFn: () => reservationsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReservationRequest) =>
      reservationsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [RESERVATIONS_KEY] }),
  });
}

export function useUpdateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateReservationRequest;
    }) => reservationsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [RESERVATIONS_KEY] }),
  });
}

export function useDeleteReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reservationsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [RESERVATIONS_KEY] }),
  });
}
