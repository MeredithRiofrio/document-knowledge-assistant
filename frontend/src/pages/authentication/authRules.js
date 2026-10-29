import { z } from "zod";

export const createSignUp = z.object({
  email: z.string().min(1, "El correo es obligatorio.").email("Ingresa un correo válido."),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula.")
    .regex(/[a-z]/, "Debe contener al menos una letra minúscula.")
    .regex(/\d/, "Debe contener al menos un número.")
    .regex(/[\W_]/, "Debe contener al menos un símbolo."),
});

export const createSignIn = z
  .object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "La contraseña es obligatoria"),
  })
  .strict();
