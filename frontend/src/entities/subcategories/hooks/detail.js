import { useQuery } from "@tanstack/react-query";
import { getSubcategory } from "entities/subcategories/api";
import { subcategoriesKeys } from "entities/subcategories/api/queries";

// --- HOOK ---
export function useSubcategory(id, options = {}) {
  return useQuery({
    queryKey: subcategoriesKeys.detail(id),
    queryFn: ({ signal }) => getSubcategory(id, { signal }),
    enabled: !!id,
    ...options,
  });
}
