// PreviewDocModal.jsx
import PropTypes from "prop-types";
import InfoModal from "shared/ui/modal/InfoModal";
import { useChunks } from "entities/documentChunks/hooks";
import { selectChunkTexts } from "entities/documentChunks/model";

export default function PreviewDocModal({ open, id, onClose }) {
  const {
    data: chunks = [],
    isLoading,
    error,
  } = useChunks(id, { enabled: open && !!id, select: selectChunkTexts });

  return (
    <InfoModal
      open={open}
      title="Vista Previa"
      onClose={onClose}
      content={!isLoading && chunks.length === 0 ? "Documento no encontrado" : chunks}
      isLoading={isLoading}
      error={error}
    />
  );
}

PreviewDocModal.propTypes = {
  open: PropTypes.bool.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClose: PropTypes.func.isRequired,
};
