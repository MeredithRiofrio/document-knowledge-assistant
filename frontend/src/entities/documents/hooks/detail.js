import { useQuery } from "@tanstack/react-query";
import { getDocument } from "entities/documents/api";
import { documentsKeys } from "entities/documents/api/queries";

// --- HOOK ---
export function useDocument(id, options = {}) {
  return useQuery({
    queryKey: documentsKeys.detail(id),
    queryFn: ({ signal }) => getDocument(id, { signal }),
    enabled: !!id,
    ...options,
  });
}
