import React from "react";
import WithQueryClient from "./providers/QueryClientProvider";
import WithTheme from "./providers/ThemeProvider";
import RouterProvider from "./providers/RouterProvider";
import ErrorBoundary from "./providers/ErrorBoundary";

// Context original de tu plantilla
import { MaterialUIControllerProvider } from "./providers/MaterialUIContext";
// Toasts propios
import MDToastProvider from "shared/ui/MDSnackbar/MDToastProvider";

export default function App() {
  return (
    <WithQueryClient>
      <MaterialUIControllerProvider>
        <WithTheme>
          <ErrorBoundary>
            <MDToastProvider />
            <RouterProvider />
          </ErrorBoundary>
        </WithTheme>
      </MaterialUIControllerProvider>
    </WithQueryClient>
  );
}
