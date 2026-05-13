import { useMutation } from "@tanstack/react-query";

import { authApi } from "../lib/api";
import { useAuthStore } from "../stores/auth.store";
import type { LoginRequest, RegisterRequest } from "../types/auth.types";

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (res) => setSession(res),
  });
}

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (res) => setSession(res),
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);

  return () => {
    logout();
  };
}
