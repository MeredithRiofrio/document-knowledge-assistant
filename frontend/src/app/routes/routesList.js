// app/routes/routesList.js
import React, { lazy } from "react";
import { Outlet, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "widgets/AdminLayout";

import SignIn from "pages/authentication/SignInPage";
import SignUp from "pages/authentication/SignUpPage";
// import ResetPassword from "pages/authentication/ResetPasswordPage";

import DocumentsPage from "pages/documents/DocumentsPage";
import DocumentNewPage from "pages/documents/DocumentNewPage";
const DocumentEditPage = lazy(() => import("pages/documents/DocumentEditPage"));
// const DocumentReplacePage = lazy(() => import("pages/documents/DocumentReplacePage"));

import TagsPage from "pages/tags/TagsPage";

const OutletOnly = () => <Outlet />;

const routes = [
  {
    key: "admin",
    route: "/admin",
    component: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ), // <- ahora el shell está aquí, no en App.jsx
    children: [
      {
        key: "documents",
        route: "documents",
        component: <OutletOnly />,
        children: [
          { key: "docs-index", route: "", component: <DocumentsPage /> },
          { key: "docs-add", route: "add", component: <DocumentNewPage /> },
          { key: "docs-edit", route: "edit/:id", component: <DocumentEditPage /> },
          // { key: "docs-replace", route: "replace/:id", component: <DocumentReplacePage /> },
        ],
      },
      { key: "tags", route: "tags", component: <TagsPage /> },
      { key: "admin-index", route: "", component: <Navigate to="documents" replace /> },
    ],
  },
  {
    key: "sign-in",
    route: "/authentication",
    component: <OutletOnly />,
    children: [
      { key: "sign-in", route: "sign-in", component: <SignIn /> },
      { key: "sign-up", route: "sign-up", component: <SignUp /> },
      // { key: "reset-password", route: "reset-password", component: <ResetPassword /> },
      { key: "authentication-index", route: "", component: <Navigate to="sign-in" replace /> },
    ],
  },
];

export default routes;
