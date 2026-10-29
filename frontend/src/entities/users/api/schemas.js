import { z } from "zod";

export const CreateUserReq = z
  .object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  })
  .strict();

export const UserDTO = z
  .object({
    id: z.string(),
  })
  .strict();

export const LoginReq = z
  .object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "La contraseña es obligatoria"),
  })
  .strict();

export const LoginResponseDTO = z.object({
  // user_id: z.string(),
  access_token: z.string(), // JWT
  refresh_token: z.string().optional(),
});
