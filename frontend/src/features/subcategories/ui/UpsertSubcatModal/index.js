// UpsertSubcatModal.jsx
import { useCallback, useMemo, useId } from "react";
import PropTypes from "prop-types";
import {
  useCreateSubcategory,
  useSubcategory,
  useUpdateSubcategory,
} from "entities/subcategories/hooks";
import { useCategories } from "entities/categories/hooks";
import mdToast from "shared/ui/MDSnackbar/mdToast";
import FormModal from "shared/ui/modal/FormModal";
import SubcategoryForm from "./SubcategoryForm";
import { selectCategoryOptions } from "entities/categories/model";
import { buildPrePayloadStrict } from "shared/libs/buildPrePayloadStrict";

export default function UpsertSubcatModal({ open, mode, id, onClose }) {
  const isEdit = mode === "edit";

  const {
    data: subcategory,
    isPending: isQueryPending,
    isFetching,
    error: errorSubcat,
  } = useSubcategory(id, { enabled: open && isEdit && !!id });
  const isLoadingSubcategory = open && isEdit && Boolean(id) && (isQueryPending || isFetching);

  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: errorCategories,
  } = useCategories({}, { enabled: open, select: selectCategoryOptions });

  const { mutateAsync: updateSubcategory, isPending: isSaving } = useUpdateSubcategory(
    id || undefined
  );
  const { mutateAsync: createSubcategory, isPending: isCreating } = useCreateSubcategory();

  const defaultValues = useMemo(
    () => ({
      name: subcategory?.name ?? "",
      categoryId: subcategory?.categoryId ?? "",
    }),
    [subcategory]
  );

  const handleSubmit = useCallback(
    async (dirtyFields, values, defaults) => {
      try {
        if (isEdit) {
          const patch = buildPrePayloadStrict(dirtyFields, values, defaults);
          if (Object.keys(patch).length === 0) {
            mdToast.info("No hay cambios para guardar.");
            return;
          }
          await updateSubcategory(patch);
          mdToast.success("La subcategoría se ha actualizado correctamente.");
        } else {
          await createSubcategory(values);
          mdToast.success("La subcategoría se ha creado correctamente.");
        }
        onClose();
      } catch (e) {
        mdToast.error(e?.message || "No se pudo actualizar la subcategoría.");
      }
    },
    [isEdit, updateSubcategory, createSubcategory, onClose]
  );

  const isBusy = isLoadingSubcategory || isLoadingCategories || isSaving || isCreating;
  const combinedError = (isEdit ? errorSubcat : undefined) || errorCategories;
  const title = open ? (isEdit ? "Editar subcategoría" : "Crear subcategoría") : "";
  const formId = `subcategory-form-${useId()}`;

  return (
    <FormModal
      open={open}
      title={title}
      onClose={onClose}
      isLoading={isBusy}
      error={combinedError}
      formId={formId}
    >
      <SubcategoryForm
        key={id || "new"}
        formId={formId}
        options={categories || []}
        defaultValues={defaultValues}
        isEdit={isEdit}
        onSubmit={handleSubmit}
      />
    </FormModal>
  );
}

UpsertSubcatModal.propTypes = {
  open: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(["create", "edit"]).isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClose: PropTypes.func.isRequired, // << corregido
};
