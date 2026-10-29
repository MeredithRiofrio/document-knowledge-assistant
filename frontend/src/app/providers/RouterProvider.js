import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "../routes";

import LoadingPage from "shared/ui/LoadingPage";

export default function RouterProvider() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}
