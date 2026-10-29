// shared/ui/ErrorPage/index.js
import React from "react";
import PropTypes from "prop-types";

// usa tus wrappers
import MDBox from "shared/ui/MDBox";
import MDTypography from "shared/ui/MDTypography";
import MDButton from "shared/ui/MDButton";

export default function ErrorPage({ message = "Ocurrió un error inesperado.", onRetry }) {
  return (
    <MDBox
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        textAlign: "center",
        px: 2,
      }}
    >
      <MDTypography variant="h1" component="h1">
        ¡Ups!
      </MDTypography>

      <MDTypography variant="body1">{message}</MDTypography>

      <MDBox sx={{ mt: 1 }}>
        {onRetry && (
          <MDButton variant="contained" color="info" onClick={onRetry}>
            Reintentar
          </MDButton>
        )}
      </MDBox>
    </MDBox>
  );
}

ErrorPage.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
};
