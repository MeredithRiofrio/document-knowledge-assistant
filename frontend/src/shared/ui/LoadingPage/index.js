// shared/ui/LoadingPage/index.js
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import MDBox from "shared/ui/MDBox";
import MDTypography from "shared/ui/MDTypography";

export default function LoadingPage() {
  return (
    <MDBox
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <CircularProgress color="info" />
      <MDTypography variant="body1">Cargando…</MDTypography>
    </MDBox>
  );
}
