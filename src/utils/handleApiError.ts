import type { AxiosError } from "axios";

interface ApiErrorPayload {
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ParsedApiError {
  message: string;
  fieldErrors: Record<string, string>;
}

export function parseApiError(error: unknown): ParsedApiError {
  const err = error as AxiosError<ApiErrorPayload>;
  const payload = err.response?.data;
  const fieldErrors = Object.fromEntries(
    Object.entries(payload?.errors ?? {}).map(([field, messages]) => [
      field,
      messages[0] ?? "Invalid value.",
    ]),
  );

  return {
    message: payload?.message ?? err.message ?? "An unexpected error occurred.",
    fieldErrors,
  };
}

export function handleApiError(error: unknown): string {
  return parseApiError(error).message;
}
