// features/subcategories/ui/DeleteSubcatModal.jsx
import React, { useCallback } from "react";
import PropTypes from "prop-types";
import ConfirmModal from "shared/ui/modal/ConfirmModal";
import { useDeleteCategory } from "entities/categories/hooks";
import mdToast from "shared/ui/MDSnackbar/mdToast";

const DeleteCatModal = ({ open, category, onClose }) => {
  const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const handleConfirm = useCallback(async () => {
    const id = category?.id;
    if (!id) return;
    try {
      await deleteCategory(id);
      mdToast.success("La categoría se eliminó correctamente.");
      onClose();
    } catch (e) {
      mdToast.error(e?.message || "No se pudo eliminar la categoría.");
    }
  }, [category, deleteCategory, onClose]);

  const handleClose = useCallback(() => {
    if (!isDeleting) onClose();
  }, [isDeleting, onClose]);

  const name = category?.name;

  return (
    <ConfirmModal
      open={open}
      title="Eliminar categoría"
      message={
        name
          ? `Esta operación eliminará la categoría "${name}". ¿Deseas continuar?`
          : "Esta operación eliminará la categoría seleccionada. ¿Deseas continuar?"
      }
      onClose={handleClose}
      onConfirm={handleConfirm}
      isLoading={isDeleting}
    />
  );
};

DeleteCatModal.propTypes = {
  open: PropTypes.bool.isRequired,
  category: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default DeleteCatModal;
