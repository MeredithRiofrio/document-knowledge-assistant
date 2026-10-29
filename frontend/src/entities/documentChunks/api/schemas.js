import { z } from "zod";

// Item individual dentro de chunks_list
export const ChunkItemDTO = z.object({
  chunk_id: z.string(),
  chunk_text: z.string().optional(),
});

// Documento con su lista de chunks
export const DocChunksDTO = z.object({
  doc_id: z.string(),
  chunks_list: z.array(ChunkItemDTO),
});

// Página de documentos con chunks (por si hay paginación)
export const DocChunksPageDTO = z.object({
  data: z.array(DocChunksDTO),
  page: z.number().optional(),
  page_size: z.number().optional(),
  total: z.number().optional(),
});

// -------------

const ChunkUpdate = z.object({
  chunk_id: z.string().min(1),
  new_chunk: z.string().min(1),
});

const ChunkDelete = z.object({
  chunk_id: z.string().min(1),
});

export const UpdateChunkReq = z
  .object({
    chunks_update: z.array(ChunkUpdate).optional(),
  })
  .strict();

export const DeleteChunkReq = z
  .object({
    chunks_delete: z.array(ChunkDelete).optional(),
  })
  .strict();
