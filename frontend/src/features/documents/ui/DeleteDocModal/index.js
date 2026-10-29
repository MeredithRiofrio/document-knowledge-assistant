// features/subcategories/ui/DeleteSubcatModal.jsx
import React, { useCallback } from "react";
import PropTypes from "prop-types";
import ConfirmModal from "shared/ui/modal/ConfirmModal";
import { useDeleteDocument } from "entities/documents/hooks";
import mdToast from "shared/ui/MDSnackbar/mdToast";

const DeleteDocModal = ({ open, document, onClose }) => {
  const { mutateAsync: deleteDocument, isPending: isDeleting } = useDeleteDocument();

  const handleConfirm = useCallback(async () => {
    const id = document?.id;
    if (!id) return;
    try {
      await deleteDocument(id);
      mdToast.success("El documento se eliminó correctamente.");
      onClose();
    } catch (e) {
      mdToast.error(e?.message || "No se pudo eliminar el documento.");
    }
  }, [document, deleteDocument, onClose]);

  const handleClose = useCallback(() => {
    if (!isDeleting) onClose();
  }, [isDeleting, onClose]);

  const name = document?.name;

  return (
    <ConfirmModal
      open={open}
      title="Eliminar documento"
      message={
        name
          ? `Esta operación eliminará el documento "${name}". ¿Deseas continuar?`
          : "Esta operación eliminará el documento seleccionado. ¿Deseas continuar?"
      }
      onClose={handleClose}
      onConfirm={handleConfirm}
      isLoading={isDeleting}
    />
  );
};

DeleteDocModal.propTypes = {
  open: PropTypes.bool.isRequired,
  document: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default DeleteDocModal;
