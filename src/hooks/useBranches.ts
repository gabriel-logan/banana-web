import { useQuery } from "@tanstack/react-query";

import { branchesApi } from "../lib/api";

const BRANCHES_KEY = "branches";

export function useBranches() {
  return useQuery({
    queryKey: [BRANCHES_KEY],
    queryFn: branchesApi.getAll,
  });
}
