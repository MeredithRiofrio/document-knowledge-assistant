// DTO -> Model (frontend cómodo)
export const fromDocChunksDTO = (d) => ({
  id: String(d.doc_id),
  chunks: Array.isArray(d.chunks_list)
    ? d.chunks_list.map((c) => ({
        id: String(c.chunk_id),
        text: c.chunk_text,
      }))
    : [],
});

export const toUpdateChunkDTO = (updates) => {
  const dto = {};

  if (Array.isArray(updates) && updates.length > 0) {
    dto.chunks_update = updates.map((u) => ({
      chunk_id: String(u.id),
      new_chunk: String(u.text),
    }));
  }

  return dto;
};

export const toDeleteChunkDTO = (deletes) => {
  const dto = {};

  if (Array.isArray(deletes) && deletes.length > 0) {
    dto.chunks_delete = deletes.map((d) => ({
      chunk_id: String(d.id),
    }));
  }

  return dto;
};
