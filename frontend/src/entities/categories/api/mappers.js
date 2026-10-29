export const fromCategoryDTO = (d) => ({
  id: String(d.category_id),
  name: d.category_name,
  subcategoryCount: d.subcategory_count == null ? 0 : Number(d.subcategory_count),
});

export const fromCategoriesListDTO = (raw) => {
  const list = Array.isArray(raw) ? raw : raw?.data ?? [];
  return list.map(fromCategoryDTO);
};

export const toCreateCategoryDTO = (c) => ({
  category_name: String(c.name).trim(),
});

export const toUpdateCategoryDTO = (values) => ({
  category_name: String(values.name),
});
