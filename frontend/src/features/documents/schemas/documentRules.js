import { z } from "zod";

// ——— Utilidades ———
const trimGet = (v) => (typeof v === "string" ? v : v?.label ?? "").trim();
const hasEmoji = (s) => /[\u{1F600}-\u{1F64F}]/u.test(s);

// Valida "string" O "objeto { id?, label }" sin transformar el valor.
const strOrObj = ({ field, min, max, required = false }) =>
  z.any().superRefine((v, ctx) => {
    // tipo permitido
    const isStr = typeof v === "string";
    const isObj =
      v !== null && typeof v === "object" && ("label" in v || "id" in v || "isCustom" in v);

    if (!isStr && !isObj) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${field}: formato inválido`,
      });
      return;
    }

    // chequear forma del objeto si es objeto
    if (isObj) {
      const { id, label } = v;
      const idOk =
        id === undefined || id === null || typeof id === "string" || typeof id === "number";
      if (!idOk) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["id"],
          message: `${field}: id inválido`,
        });
      }
      if (label !== undefined && typeof label !== "string") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["label"],
          message: `${field}: label inválido`,
        });
      }
    }

    // longitudes sobre el texto visible
    const text = trimGet(v);

    if (required && text.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${field} es obligatoria`,
      });
    }
    if (min && text.length < min) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${field} debe contener mínimo ${min} caracteres`,
      });
    }
    if (max && text.length > max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${field} no puede exceder los ${max} caracteres`,
      });
    }
  });

// Archivo PDF (no asume disponibilidad de window.File)
const pdfFile = (maxMB, requiredMsg = "Debes subir un archivo") =>
  z.any().superRefine((f, ctx) => {
    if (!f) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: requiredMsg });
      return;
    }
    // tipo/mimetype
    if (f.type !== "application/pdf") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Solo se permite un archivo PDF",
      });
    }
    // tamaño
    if (typeof f.size === "number" && f.size > maxMB * 1024 * 1024) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `El archivo es muy grande (máx. ${maxMB}MB)`,
      });
    }
  });

// ——— Campos simples ———
const chunkIdSchema = z.union([z.string(), z.number()]).nullable().optional();

export const chunkTextSchema = z
  .string({ required_error: "El fragmento no puede estar vacío" })
  .trim()
  .min(2, "El texto debe contener mínimo 2 caracteres")
  .max(4000, "El texto no puede exceder los 4000 caracteres")
  .superRefine((v, ctx) => {
    if (hasEmoji(v)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "No se permiten emojis.",
      });
    }
  });

// Longitudes estándar
const categoryLen = ({ required = false } = {}) =>
  strOrObj({ field: "La categoría", min: required ? 1 : 2, max: 50, required });
const subcategoryLen = ({ required = false } = {}) =>
  strOrObj({
    field: "La subcategoría",
    min: required ? 1 : 2,
    max: 50,
    required,
  });

// ——— Schemas compuestos ———
export const tagsSchema = z
  .object({
    category: categoryLen(),
    subcategory: subcategoryLen(),
  })
  .superRefine((data, ctx) => {
    const hasCategory = trimGet(data.category).length > 0;
    const hasSubcat = trimGet(data.subcategory).length > 0;
    if (hasCategory && !hasSubcat) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["subcategory"],
        message: "Selecciona una subcategoría",
      });
    }
  });

export const docPdfSchema = z.object({
  file: pdfFile(5, "Debes adjuntar un archivo"),
});

export const formEditSchema = z.object({
  category: categoryLen({ required: true }),
  subcategory: subcategoryLen({ required: true }),
  chunks: z
    .array(
      z.object({
        id: chunkIdSchema,
        text: chunkTextSchema,
      })
    )
    .min(1, "Debes agregar al menos un fragmento"),
});

export const formReplaceSchema = z.object({
  file: pdfFile(5, "Debes subir un archivo"),
});

export const createDocSchema = z.object({
  category: categoryLen(),
  subcategory: subcategoryLen(),
  file: pdfFile(5, "Debes subir un archivo"),
});
