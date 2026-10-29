import { z } from "zod";

// Caracteres permitidos: letras (incluye acentos), números, espacios y algunos signos comunes.
const allowedPattern = /^[\p{L}\p{N}\s\-_.(),#&/]+$/u;

export const categorySchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio" })
    .trim()
    .min(2, "Mínimo 2 caracteres")
    .max(50, "Máximo 50 caracteres")
    .regex(allowedPattern, "Hay caracteres no permitidos")
    // Normaliza espacios internos (opcional pero útil)
    .transform((v) => v.replace(/\s+/g, " ")),
});
