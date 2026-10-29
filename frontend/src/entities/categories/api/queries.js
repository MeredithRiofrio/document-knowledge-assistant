export const categoriesKeys = {
  all: ["categories"],
  list: (filters = {}) => ["categories", "list", { ...filters }],
  detail: (id) => ["categories", "detail", id],
};
