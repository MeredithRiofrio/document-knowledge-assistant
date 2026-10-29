import React, { useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import MDBox from "shared/ui/MDBox";
import PageHeader from "shared/ui/PageHeader";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

import { useChunks } from "entities/documentChunks/hooks";
import { selectChunkTexts } from "entities/documentChunks/model";

import ReplaceDocumentForm from "features/documents/ui/forms/ReplaceDocumentForm";
import CurrentDocumentPreview from "features/documents/fields/CurrentDocumentPreview";
import { useReplaceDocument } from "entities/documents/hooks";
import mdToast from "shared/ui/MDSnackbar/mdToast";

const ReplaceDocumentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Ahora chunks === string (texto unido)
  const { data: chunks, isLoading, error } = useChunks(id, { select: selectChunkTexts });

  const { mutateAsync: replaceDocument, isPending } = useReplaceDocument(id);

  const handleSubmit = useCallback(
    async (formValues) => {
      try {
        await replaceDocument(formValues); // formValues: { file }
        mdToast.success("El documento se ha actualizado correctamente.");
        navigate("/admin/documents");
      } catch (e) {
        mdToast.error(e?.message || "Error al actualizar el documento.");
      }
    },
    [id, replaceDocument, navigate]
  );

  const defaults = useMemo(() => ({ file: null }), []);

  return (
    <>
      <MDBox pb={3}>
        <Grid item xs={12}>
          <PageHeader title="Reemplazar Documento" />
        </Grid>
      </MDBox>

      <MDBox mb={3}>
        <Card>
          <MDBox p={3}>
            <CurrentDocumentPreview
              isLoading={isLoading}
              error={error}
              text={chunks ?? ""}
              height="400px"
            />
          </MDBox>
        </Card>
      </MDBox>

      <MDBox my={3} display="flex" justifyContent="center">
        <Icon fontSize="large" sx={{ transform: "rotate(90deg)" }}>
          swap_horiz
        </Icon>
      </MDBox>

      <ReplaceDocumentForm
        defaultValues={defaults}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
      />
    </>
  );
};

export default ReplaceDocumentPage;
