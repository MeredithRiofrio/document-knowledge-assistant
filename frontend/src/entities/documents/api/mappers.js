// DTO -> Model (frontend cómodo)
export const fromDocumentDTO = (d) => ({
  id: String(d.doc_id),
  name: d.doc_name,
  categoryId: d.category_id ?? null,
  categoryName: d.category_id ?? null,
  subcategoryId: d.subcategory_id ?? null,
  subcategoryName: d.category_id ?? null,
  uploadDate: d.upload_date ? new Date(d.upload_date) : null,
});

export const fromDocumentsListDTO = (raw) => {
  const list = Array.isArray(raw) ? raw : raw?.data ?? [];
  return list.map(fromDocumentDTO);
};

// Model -> DTO (para JSON)
export const toCreateDocumentDTO = (values) => {
  const dto = {};

  // Category
  if (values.category) {
    const { id, label } = values.category;
    if (id) {
      dto.category_id = String(id);
    } else if (label) {
      dto.category_name = String(label);
    }
  }

  // Subcategory
  if (values.subcategory) {
    const { id, label } = values.subcategory;
    if (id) {
      dto.subcategory_id = String(id);
    } else if (label) {
      dto.subcategory_name = String(label);
    }
  }

  // File siempre se manda
  dto.file = values.file;

  return dto;
};

export const toUpdateDocumentDTO = (values) => {
  const dto = {};

  // Category
  if (values.category) {
    const { id, label } = values.category;
    if (id) {
      dto.category_id = String(id);
    } else if (label) {
      dto.category_name = String(label);
    }
  }

  // Subcategory
  if (values.subcategory) {
    const { id, label } = values.subcategory;
    if (id) {
      dto.subcategory_id = String(id);
    } else if (label) {
      dto.subcategory_name = String(label);
    }
  }

  // Chunks
  if (values.chunks) {
    const { updates, deletes } = values.chunks;

    if (Array.isArray(updates) && updates.length > 0) {
      dto.chunks_update = updates.map((u) => ({
        chunk_id: String(u.id),
        new_chunk: String(u.text),
      }));
    }

    if (Array.isArray(deletes) && deletes.length > 0) {
      dto.chunks_delete = deletes.map((d) => ({
        chunk_id: String(d.id),
      }));
    }
  }
  return dto;
};

export const toReplaceDocumentDTO = (values) => ({
  file: values.file,
});
