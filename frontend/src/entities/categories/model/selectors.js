// entities/categories/model/selectors.js
export const selectCategoriesById = (cats = []) => Object.fromEntries(cats.map((c) => [c.id, c]));

export const selectCategoryOptions = (categories) =>
  (categories ?? []).map((c) => ({
    id: c.id,
    label: c.name,
  }));
