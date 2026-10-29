// src/hooks/useCategoryMutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesKeys } from "entities/categories/api/queries";
import { subcategoriesKeys } from "entities/subcategories/api/queries";
import { documentsKeys } from "entities/documents/api/queries";
import { createCategory, updateCategory, deleteCategory } from "entities/categories/api";

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (model) => createCategory(model),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: categoriesKeys.list() });
      qc.setQueryData(categoriesKeys.detail(created.id), created);
    },
  });
}

export function useUpdateCategory(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (model) => updateCategory(id, model),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: categoriesKeys.list() });
      qc.setQueryData(categoriesKeys.detail(updated.id), updated);
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: (_res, id) => {
      qc.invalidateQueries({ queryKey: categoriesKeys.list() });
      qc.invalidateQueries({ queryKey: subcategoriesKeys.list() });
      qc.invalidateQueries({ queryKey: documentsKeys.list() });
      qc.removeQueries({ queryKey: categoriesKeys.detail(id) });
    },
  });
}
