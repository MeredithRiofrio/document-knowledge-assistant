export const subcategoriesKeys = {
  all: ["subcategories"],
  list: (filters = {}) => ["subcategories", "list", { ...filters }],
  detail: (id) => ["subcategories", "detail", id],
};
