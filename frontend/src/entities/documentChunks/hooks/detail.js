import { useQuery } from "@tanstack/react-query";
import { getDocChunks } from "entities/documentChunks/api";
import { chunksKeys } from "entities/documentChunks/api/queries";

export function useChunks(id, options = {}) {
  return useQuery({
    queryKey: chunksKeys.detail(id),
    queryFn: ({ signal }) => getDocChunks(id, { signal }),
    enabled: !!id,
    ...options,
  });
}
