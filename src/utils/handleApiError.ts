import type { AxiosError } from "axios"

export function handleApiError(error: unknown): string {
  const err = error as AxiosError<{ message?: string }>
  return err.response?.data?.message ?? err.message ?? "An unexpected error occurred"
}
