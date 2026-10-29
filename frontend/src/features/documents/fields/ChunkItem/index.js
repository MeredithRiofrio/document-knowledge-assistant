import PropTypes from "prop-types";
import { useState, useRef } from "react";
import { useController, useFormContext } from "react-hook-form";

// MUI
import Icon from "@mui/material/Icon";

// Componentes
import MDBox from "shared/ui/MDBox";
import MDTypography from "shared/ui/MDTypography";
import MDButton from "shared/ui/MDButton";

// Ejemplos
import ConfirmModal from "shared/ui/modal/ConfirmModal";
import InfoModal from "shared/ui/modal/InfoModal";

// Contexto
import { useMaterialUIController } from "app/providers/MaterialUIContext";

// Formulario
import ChunkEditor from "./ChunkEditor";

function ChunkItem({ index, name, onDelete }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const { setValue } = useFormContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const {
    field,
    fieldState: { error },
  } = useController({ name });

  const text = (field.value ?? "").toString();
  const shouldTruncate = text.length > 500;

  // Snapshot por sesión de edición
  const originalRef = useRef(text);

  const startEdit = () => {
    originalRef.current = (field.value ?? "").toString(); // captura al abrir
    setIsEditing(true);
  };

  const cancelEdit = () => {
    // Revertir al snapshot exacto
    setValue(name, originalRef.current, { shouldDirty: false, shouldValidate: false });
    setIsEditing(false);
  };

  return (
    <MDBox
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      bgColor={darkMode ? "grey-700" : "grey-100"}
      borderRadius="lg"
      p={3}
      mt={2}
    >
      <MDBox width="100%" display="flex" flexDirection="column">
        <MDBox display="flex" justifyContent="space-between" mb={2}>
          <MDTypography variant="button" fontWeight="medium">
            Fragmento #{index}
          </MDTypography>

          <MDBox display="flex" alignItems="center">
            <MDBox mr={1}>
              <MDButton variant="text" color="error" onClick={() => setShowDeleteModal(true)}>
                <Icon>delete</Icon>&nbsp;Eliminar
              </MDButton>
            </MDBox>
            <MDButton
              variant="text"
              color={darkMode ? "white" : "dark"}
              disabled={isEditing}
              onClick={startEdit}
            >
              <Icon>edit</Icon>&nbsp;Editar
            </MDButton>
          </MDBox>
        </MDBox>

        <MDBox mb={1} lineHeight={0} maxWidth="100%">
          {isEditing ? (
            <ChunkEditor
              name={name}
              snapshotValue={originalRef.current}
              onSave={() => setIsEditing(false)} // solo cierra
              onCancel={cancelEdit} // revierte al snapshot
            />
          ) : (
            <>
              <MDTypography
                variant="caption"
                lineClamp={shouldTruncate ? 5 : undefined}
                color={error ? "error" : "text"}
              >
                {text}
              </MDTypography>

              {shouldTruncate && (
                <MDTypography
                  mt={1}
                  textAlign="right"
                  display="block"
                  variant="caption"
                  onClick={() => setShowViewModal(true)}
                >
                  Ver más
                </MDTypography>
              )}
            </>
          )}
        </MDBox>
      </MDBox>

      <ConfirmModal
        open={showDeleteModal}
        title="Eliminar fragmento"
        message="¿Estás seguro de que deseas eliminar este fragmento? Esta acción no se puede deshacer."
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDelete();
          setShowDeleteModal(false);
        }}
        confirmText="Eliminar"
      />

      <InfoModal
        open={showViewModal}
        title={`Fragmento #${index}`}
        content={text}
        onClose={() => setShowViewModal(false)}
      />
    </MDBox>
  );
}

ChunkItem.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ChunkItem;
