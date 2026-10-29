export const fromSubcategoryDTO = (d) => ({
  id: String(d.subcategory_id),
  name: d.subcategory_name,
  categoryId: String(d.category_id),
  categoryName: d.category_name ?? null,
  documentCount: d.document_count == null ? 0 : Number(d.document_count),
});

export const fromSubcategoriesListDTO = (raw) => {
  const list = Array.isArray(raw) ? raw : raw?.data ?? [];
  return list.map(fromSubcategoryDTO);
};

export const toCreateSubcategoryDTO = (s) => ({
  subcategory_name: String(s.name).trim(),
  category_id: String(s.categoryId),
});

export const toUpdateSubcategoryDTO = (values) => ({
  ...(values.name !== undefined && { subcategory_name: values.name }),
  ...(values.categoryId !== undefined && { category_id: values.categoryId }),
});
