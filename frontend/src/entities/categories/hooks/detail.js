// src/hooks/useCategory.js
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "entities/categories/api"; // se mantiene el import real
import { categoriesKeys } from "entities/categories/api/queries";

// --- HOOK ---
export function useCategory(id, options = {}) {
  return useQuery({
    queryKey: categoriesKeys.detail(id),
    queryFn: ({ signal }) => getCategory(id, { signal }),
    enabled: !!id,
    ...options,
  });
}
