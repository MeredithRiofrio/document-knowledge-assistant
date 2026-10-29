import { useQuery } from "@tanstack/react-query";
import { listDocuments } from "entities/documents/api";
import { documentsKeys } from "entities/documents/api/queries";

// --- HOOK ---
export function useDocuments(filters = {}, options = {}) {
  return useQuery({
    queryKey: documentsKeys.list(filters),
    queryFn: ({ signal }) => listDocuments(filters, { signal }),
    placeholderData: (prev) => prev,
    select: (res) => res,
    ...options,
  });
}
