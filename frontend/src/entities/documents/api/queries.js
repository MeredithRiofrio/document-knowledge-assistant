export const documentsKeys = {
  all: ["documents"],
  list: (filters = {}) => ["documents", "list", { ...filters }],
  detail: (id) => ["documents", "detail", id],
};
