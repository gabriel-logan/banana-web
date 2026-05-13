import { useQuery } from "@tanstack/react-query";

import { branchesApi } from "../lib/api";

const BRANCHES_KEY = "branches";

export function useBranches(
  startTime?: string,
  endTime?: string,
  ignoreReservationId?: number,
) {
  return useQuery({
    queryKey: [
      BRANCHES_KEY,
      startTime ?? "no-start",
      endTime ?? "no-end",
      ignoreReservationId ?? "no-ignore",
    ],
    queryFn: () =>
      branchesApi.getAll({
        startTime,
        endTime,
        ignoreReservationId,
      }),
  });
}
