// src/hooks/useCategories.js
import { useQuery } from "@tanstack/react-query";
import { listCategories } from "entities/categories/api"; // se mantiene el import real
import { categoriesKeys } from "entities/categories/api/queries";

// --- HOOK ---
export function useCategories(filters = {}, options = {}) {
  return useQuery({
    queryKey: categoriesKeys.list(filters),
    queryFn: ({ signal }) => listCategories(filters, { signal }),
    placeholderData: (prev) => prev,
    select: (res) => res,
    ...options,
  });
}
