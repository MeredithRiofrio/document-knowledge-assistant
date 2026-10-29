import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subcategoriesKeys } from "entities/subcategories/api/queries";
import { categoriesKeys } from "entities/categories/api/queries";
import {
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "entities/subcategories/api";

export function useCreateSubcategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (model) => createSubcategory(model),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: subcategoriesKeys.list() });
      qc.invalidateQueries({ queryKey: categoriesKeys.list() });
      qc.setQueryData(subcategoriesKeys.detail(created.id), created);
    },
  });
}

export function useUpdateSubcategory(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (model) => updateSubcategory(id, model),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: subcategoriesKeys.list() });
      qc.invalidateQueries({ queryKey: categoriesKeys.list() });
      qc.setQueryData(subcategoriesKeys.detail(updated.id), updated);
    },
  });
}

export function useDeleteSubcategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteSubcategory(id),
    onSuccess: (_res, id) => {
      qc.invalidateQueries({ queryKey: subcategoriesKeys.list() });
      qc.invalidateQueries({ queryKey: categoriesKeys.list() });
      qc.removeQueries({ queryKey: subcategoriesKeys.detail(id) });
    },
  });
}
