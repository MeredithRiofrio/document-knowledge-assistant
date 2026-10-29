export const selectSubcategoryOptions = (subcategories) =>
  (subcategories ?? []).map((s) => ({
    id: s.id,
    label: s.name,
    categoryId: s.categoryId,
  }));

export const selectSubcategoriesById = (subcats = []) =>
  Object.fromEntries(subcats.map((s) => [s.id, s]));

export const selectSubOptionsByCategoryId = (subs = []) => {
  const grouped = {};
  for (const s of subs) {
    const k = String(s.categoryId);
    (grouped[k] ||= []).push({ id: s.id, label: s.name });
  }
  return grouped;
};
