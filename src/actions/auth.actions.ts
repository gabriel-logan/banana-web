import type { LoginRequest, RegisterRequest, AuthResponse } from "../types/auth.types"
import { authApi } from "../lib/api"

export async function loginAction(payload: LoginRequest): Promise<AuthResponse> {
  return authApi.login(payload)
}

export async function registerAction(payload: RegisterRequest): Promise<AuthResponse> {
  return authApi.register(payload)
}
