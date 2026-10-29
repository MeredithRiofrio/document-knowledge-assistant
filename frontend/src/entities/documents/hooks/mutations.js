import { useMutation, useQueryClient } from "@tanstack/react-query";
import { documentsKeys } from "entities/documents/api/queries";
import {
  createDocument,
  updateDocument,
  replaceDocument,
  deleteDocument,
} from "entities/documents/api";

// --- Hooks ---
export function useCreateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (model) => createDocument(model),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: documentsKeys.list() });
      qc.setQueryData(documentsKeys.detail(created.id), created);
    },
  });
}

export function useUpdateDocument(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (model) => updateDocument(id, model),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: documentsKeys.list() });
      qc.setQueryData(documentsKeys.detail(updated.id), updated);
    },
  });
}

export function useReplaceDocument(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (model) => replaceDocument(id, model),
    onSuccess: (replaced) => {
      qc.invalidateQueries({ queryKey: documentsKeys.list() });
      qc.setQueryData(documentsKeys.detail(replaced.id), replaced);
    },
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteDocument(id),
    onSuccess: (_res, id) => {
      qc.invalidateQueries({ queryKey: documentsKeys.list() });
      qc.removeQueries({ queryKey: documentsKeys.detail(id) });
    },
  });
}
