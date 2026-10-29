// StatusBox.js
import React from "react";
import PropTypes from "prop-types";
import MDBox from "shared/ui/MDBox";
import MDTypography from "shared/ui/MDTypography";
import CircularProgress from "@mui/material/CircularProgress";
import Icon from "@mui/material/Icon";

/**
 * Componente reutilizable para manejar estados de carga y error.
 *
 * Props:
 * - isLoading: booleano que indica si se está cargando.
 * - error: objeto de error (por ejemplo de React Query o Axios).
 * - height: altura del contenedor para loading y error.
 * - children: contenido a renderizar cuando no hay loading ni error.
 */
function StatusContent({ isLoading, error, height, children }) {
  if (isLoading) {
    return (
      <MDBox height={height} display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </MDBox>
    );
  }

  if (error) {
    return (
      <MDBox
        height={height}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Icon fontSize="large" color="error">
          warning
        </Icon>
        <MDTypography mt={1} variant="h6" color="error">
          {error?.response?.data?.message || error?.message || "Error al cargar los datos"}
        </MDTypography>
      </MDBox>
    );
  }

  return <>{children}</>;
}

StatusContent.defaultProps = {
  isLoading: false,
  error: null,
  height: "350px",
};

StatusContent.propTypes = {
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool, // por si le pasan !!error
  ]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node.isRequired,
};

export default StatusContent;
