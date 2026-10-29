import React, { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "shared/ui/MDBox";
import PageHeader from "shared/ui/PageHeader";
import StatusContent from "shared/ui/StatusContent";

import DocumentsTable from "features/documents/ui/DocumentsTable";
import DeleteDocModal from "features/documents/ui/DeleteDocModal";
import PreviewDocModal from "features/documents/ui/PreviewDocModal";

import { useDocuments } from "entities/documents/hooks";

const DocumentsListPage = () => {
  const { data: documents, isLoading, error } = useDocuments();
  const [toDelete, setToDelete] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");
  const isPreview = mode === "preview";
  const isPreviewOpen = Boolean(id && isPreview);

  const closePreview = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete("mode");
    next.delete("id");
    setSearchParams(next, { replace: false });
  }, [searchParams, setSearchParams]);

  const openDelete = useCallback((document) => {
    setToDelete(document);
  }, []);

  const closeDelete = useCallback(() => setToDelete(null), []);

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <MDBox>
              <PageHeader
                title="Documentos"
                buttonLabel="Subir Documento"
                buttonLink="/admin/documents/add"
              />
            </MDBox>

            <MDBox py={3}>
              <StatusContent isLoading={isLoading} error={error}>
                <DocumentsTable onDelete={openDelete} documents={documents ?? []} />
              </StatusContent>
            </MDBox>
          </Card>
        </Grid>
      </Grid>

      <DeleteDocModal open={!!toDelete} document={toDelete} onClose={closeDelete} />
      <PreviewDocModal
        open={isPreviewOpen}
        id={isPreviewOpen ? id : undefined}
        onClose={closePreview}
      />
    </>
  );
};

export default DocumentsListPage;
