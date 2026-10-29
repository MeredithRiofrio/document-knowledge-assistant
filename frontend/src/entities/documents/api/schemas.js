import { z } from "zod";

export const DocumentDTO = z.object({
  doc_id: z.string(),
  doc_name: z.string(),
  category_id: z.string().nullable().optional(),
  subcategory_id: z.string().nullable().optional(),
  upload_date: z.string().nullable().optional(), // "YYYY-MM-DD"
});

export const DocumentsArrayDTO = z.array(DocumentDTO);

export const DocumentsPageDTO = z.object({
  data: z.array(DocumentDTO),
  page: z.number().optional(),
  page_size: z.number().optional(),
  total: z.number().optional(),
});

// ---------------------

// const ChunkUpdate = z.object({
//   chunk_id: z.string().min(1),
//   new_chunk: z.string().min(1),
// });

// const ChunkDelete = z.object({
//   chunk_id: z.string().min(1),
// });

export const CreateDocumentReq = z
  .object({
    category_id: z.string().min(1).optional(),
    subcategory_id: z.string().min(1).optional(),
    category_name: z.string().min(1).optional(),
    subcategory_name: z.string().min(1).optional(),
    file: z.instanceof(File),
  })
  .refine((v) => !!v.file, {
    message: "El archivo es requerido",
    path: ["file"],
  })
  .strict();

export const UpdateDocumentReq = z
  .object({
    category_id: z.string().min(1).optional(),
    subcategory_id: z.string().min(1).optional(),
    category_name: z.string().min(1).optional(),
    subcategory_name: z.string().min(1).optional(),
    // chunks_update: z.array(ChunkUpdate).optional(),
    // chunks_delete: z.array(ChunkDelete).optional(),
  })
  .strict();

export const ReplaceDocumentReq = z
  .object({
    file: z.instanceof(File),
  })
  .refine((v) => !!v.file, {
    message: "El archivo es requerido",
    path: ["file"],
  })
  .strict();
