// UpsertCatModal.jsx
import { useCallback, useMemo, useEffect, useId } from "react";
import PropTypes from "prop-types";
import { useCategory, useCreateCategory, useUpdateCategory } from "entities/categories/hooks";
import mdToast from "shared/ui/MDSnackbar/mdToast";
import FormModal from "shared/ui/modal/FormModal";
import CategoryForm from "./CategoryForm";
import { buildPrePayloadStrict } from "shared/libs/buildPrePayloadStrict";

export default function UpsertCatModal({ open, mode, id, onClose }) {
  const isEdit = mode === "edit";

  const {
    data: category,
    isPending: isQueryPending,
    isFetching,
    error,
  } = useCategory(id, { enabled: open && isEdit && !!id });
  const isLoadingCategory = open && isEdit && Boolean(id) && (isQueryPending || isFetching);

  const { mutateAsync: updateCategory, isPending: isSaving } = useUpdateCategory(id || undefined);
  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory();

  const defaultValues = useMemo(() => ({ name: category?.name ?? "" }), [category]);

  const handleSubmit = useCallback(
    async (dirtyFields, values, defaults) => {
      try {
        if (isEdit) {
          const patch = buildPrePayloadStrict(dirtyFields, values, defaults);
          if (Object.keys(patch).length === 0) {
            mdToast.info("No hay cambios para guardar.");
            return;
          }
          await updateCategory(patch);
          mdToast.success("La categoría se ha actualizado correctamente.");
        } else {
          await createCategory(values);
          mdToast.success("La categoría se ha creado correctamente.");
        }
        onClose();
      } catch (e) {
        mdToast.error(e?.message || "No se pudo actualizar la categoría.");
      }
    },
    [isEdit, updateCategory, createCategory, onClose]
  );

  const isBusy = isLoadingCategory || isSaving || isCreating;
  const title = open ? (isEdit ? "Editar categoría" : "Crear categoría") : "";
  const formId = `category-form-${useId()}`;

  return (
    <FormModal
      open={open}
      title={title}
      onClose={onClose}
      isLoading={isBusy}
      error={isEdit ? error : undefined}
      formId={formId}
    >
      <CategoryForm
        key={id || "new"}
        formId={formId}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
      />
    </FormModal>
  );
}

UpsertCatModal.propTypes = {
  open: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(["create", "edit"]).isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClose: PropTypes.func.isRequired,
};
