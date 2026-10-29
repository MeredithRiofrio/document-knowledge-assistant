import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CircularProgress } from "@mui/material";
import MDBox from "shared/ui/MDBox";
import MDTypography from "shared/ui/MDTypography";
import MDButton from "shared/ui/MDButton";
import ConfirmModal from "shared/ui/modal/ConfirmModal";

function SaveSection({ isSubmitting, isDirty, isValid }) {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <MDBox textAlign="center">
        <Card>
          <MDBox pt={3} lineHeight={0}>
            <MDTypography variant="h5">¿Desea guardar los cambios?</MDTypography>
            <MDTypography variant="button" color="text" fontWeight="regular">
              Una vez modificado, se procesará el documento.
            </MDTypography>
          </MDBox>
          <MDBox p={2} pb={3}>
            <Grid container spacing={3} justifyContent="center" textAlign="center">
              <Grid item xs={12} sm={6} lg={3}>
                <MDButton
                  fullWidth
                  variant="outlined"
                  color="info"
                  onClick={() => setCancelModalOpen(true)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </MDButton>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  type="submit"
                  disabled={isSubmitting || !isDirty || !isValid}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={20} color="inherit" />
                      &nbsp; Guardando...
                    </>
                  ) : (
                    "Guardar Cambios"
                  )}
                </MDButton>
              </Grid>
            </Grid>
          </MDBox>
        </Card>
      </MDBox>

      <ConfirmModal
        open={cancelModalOpen}
        title="Descartar cambios"
        message="Esta acción eliminará cualquier cambio no guardado. ¿Desea continuar?"
        onClose={() => setCancelModalOpen(false)}
        onConfirm={() => {
          setCancelModalOpen(false);
          navigate("/admin/documents");
        }}
        confirmText="Confirmar"
        cancelText="Volver"
      />
    </>
  );
}

SaveSection.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  isDirty: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
};

export default SaveSection;
