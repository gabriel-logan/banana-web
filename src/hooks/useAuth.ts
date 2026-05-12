import { useMutation } from "@tanstack/react-query"
import { authApi } from "../lib/api"
import { useAuthStore } from "../stores/auth.store"
import type { LoginRequest, RegisterRequest } from "../types/auth.types"

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (res) => setAuth(res.token, res.user),
  })
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (res) => setAuth(res.token, res.user),
  })
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout)

  return () => {
    logout()
  }
}
