import { useQuery } from "@tanstack/react-query";

import { roomsApi } from "../lib/api";

const ROOMS_KEY = "rooms";

export function useRooms(
  branchId?: number,
  startTime?: string,
  endTime?: string,
  ignoreReservationId?: number,
) {
  return useQuery({
    queryKey: [
      ROOMS_KEY,
      branchId ?? "all",
      startTime ?? "no-start",
      endTime ?? "no-end",
      ignoreReservationId ?? "no-ignore",
    ],
    queryFn: () =>
      roomsApi.getAll({
        branchId,
        startTime,
        endTime,
        ignoreReservationId,
      }),
  });
}
