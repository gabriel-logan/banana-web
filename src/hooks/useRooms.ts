import { useQuery } from "@tanstack/react-query";

import { roomsApi } from "../lib/api";

const ROOMS_KEY = "rooms";

export function useRooms() {
  return useQuery({
    queryKey: [ROOMS_KEY],
    queryFn: roomsApi.getAll,
  });
}
