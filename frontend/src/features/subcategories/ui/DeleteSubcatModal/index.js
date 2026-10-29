// features/subcategories/ui/DeleteSubcatModal.jsx
import React, { useCallback } from "react";
import PropTypes from "prop-types";
import ConfirmModal from "shared/ui/modal/ConfirmModal";
import { useDeleteSubcategory } from "entities/subcategories/hooks";
import mdToast from "shared/ui/MDSnackbar/mdToast";

const DeleteSubcatModal = ({ open, subcategory, onClose }) => {
  const { mutateAsync: deleteSubcategory, isPending: isDeleting } = useDeleteSubcategory();

  const handleConfirm = useCallback(async () => {
    const id = subcategory?.id;
    if (!id) return;
    try {
      await deleteSubcategory(id);
      mdToast.success("La subcategoría se eliminó correctamente.");
      onClose();
    } catch (e) {
      mdToast.error(e?.message || "No se pudo eliminar la subcategoría.");
    }
  }, [subcategory, deleteSubcategory, onClose]);

  const handleClose = useCallback(() => {
    if (!isDeleting) onClose();
  }, [isDeleting, onClose]);

  const name = subcategory?.name;

  return (
    <ConfirmModal
      open={open}
      title="Eliminar subcategoría"
      message={
        name
          ? `Esta operación eliminará la subcategoría "${name}". ¿Deseas continuar?`
          : "Esta operación eliminará la subcategoría seleccionada. ¿Deseas continuar?"
      }
      onClose={handleClose}
      onConfirm={handleConfirm}
      isLoading={isDeleting}
    />
  );
};

DeleteSubcatModal.propTypes = {
  open: PropTypes.bool.isRequired,
  subcategory: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default DeleteSubcatModal;
