// src/entities/users/hooks/mutations.js
// ------------------ Hooks ------------------ Se maneja en el documento
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, createUser } from "entities/users/api";

export function useLogin() {
  return useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      localStorage.setItem("access_token", res.access_token);
      localStorage.setItem("refresh_token", res.refresh_token);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (model) => createUser(model),
  });
}
