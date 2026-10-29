import { useQuery } from "@tanstack/react-query";
import { listSubcategories } from "entities/subcategories/api";
import { subcategoriesKeys } from "entities/subcategories/api/queries";

// --- HOOK ---
export function useSubcategories(filters = {}, options = {}) {
  return useQuery({
    queryKey: subcategoriesKeys.list(filters),
    queryFn: ({ signal }) => listSubcategories(filters, { signal }),
    placeholderData: (prev) => prev,
    select: (res) => res,
    ...options, // Sobreescribe solo lo anterior
  });
}
