import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chunksKeys } from "entities/documentChunks/api/queries";
import { updateDocChunks, deleteDocChunks } from "entities/documentChunks/api";

// --- Hooks ---
export function useUpdateDocChunks(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (model) => updateDocChunks(id, model),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: chunksKeys.list() });
      qc.setQueryData(chunksKeys.detail(updated.id), updated);
    },
  });
}

export function useDeleteDocChunks(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (model) => deleteDocChunks(id, model),
    onSuccess: (deleted) => {
      qc.invalidateQueries({ queryKey: chunksKeys.list() });
      qc.removeQueries(chunksKeys.detail(deleted.id));
    },
  });
}
