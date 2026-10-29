export const chunksKeys = {
  all: ["documentChunks"],
  list: (filters = {}) => ["documentChunks", "list", { ...filters }],
  detail: (id) => ["documentChunks", "detail", id],
};
