import { authApi } from "../lib/api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth.types";

export async function loginAction(
  payload: LoginRequest,
): Promise<AuthResponse> {
  return authApi.login(payload);
}

export async function registerAction(
  payload: RegisterRequest,
): Promise<AuthResponse> {
  return authApi.register(payload);
}
