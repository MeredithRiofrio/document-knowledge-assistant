import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import themeLight from "shared/theme/light";
import themeDark from "shared/theme/dark";
import { useMaterialUIController } from "app/providers/MaterialUIContext";

export default function WithTheme({ children }) {
  const [controller] = useMaterialUIController();
  const { direction, darkMode } = controller;

  useEffect(() => {
    document.body.setAttribute("dir", direction || "ltr");
  }, [direction]);

  return (
    <ThemeProvider theme={darkMode ? themeDark : themeLight}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

WithTheme.propTypes = { children: PropTypes.any };
