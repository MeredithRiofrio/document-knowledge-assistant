import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import routes from "app/routes/routesList";
import { renderRoutes } from "app/routes/RouteBuilder";

export default function AppRoutes() {
  return (
    <Routes>
      {renderRoutes(routes)}
      <Route path="*" element={<Navigate to="/authentication/sign-in" replace />} />
    </Routes>
  );
}
