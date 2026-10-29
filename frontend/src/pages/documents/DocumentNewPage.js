// pages/documents/NewDocument.page.jsx
import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import MDBox from "shared/ui/MDBox";
import MDTypography from "shared/ui/MDTypography";

import CreateDocumentForm from "features/documents/ui/forms/CreateDocumentForm";
import { useCreateDocument } from "entities/documents/hooks";
import mdToast from "shared/ui/MDSnackbar/mdToast";

export default function NewDocumentPage() {
  const navigate = useNavigate();

  // 1) defaults del form (sin dependencias)
  const defaultValues = useMemo(
    () => ({
      category: "",
      subcategory: "",
      file: null,
    }),
    []
  );

  // 2) mutación
  const { mutateAsync: createDocument, isPending } = useCreateDocument();

  // 3) submit (la page decide qué hacer con el resultado)
  const handleSubmit = useCallback(
    async (values) => {
      try {
        await createDocument(values);
        mdToast.success("Documento creado correctamente.");
        navigate("/admin/documents");
      } catch (e) {
        const detail = e?.response?.data?.detail || e?.response?.data?.message;
        mdToast.error(detail || e?.message || "Error al crear el documento.");
      }
    },
    [createDocument, navigate]
  );

  return (
    <>
      <MDBox pb={3}>
        <MDTypography variant="h4">Crear Documento</MDTypography>
      </MDBox>

      <CreateDocumentForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
      />
    </>
  );
}
