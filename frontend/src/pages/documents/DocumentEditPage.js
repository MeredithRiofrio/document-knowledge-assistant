// EditDocumentPage.jsx
import React, { useMemo, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import MDBox from "shared/ui/MDBox";
import Grid from "@mui/material/Grid";
import MDTypography from "shared/ui/MDTypography";
import StatusContent from "shared/ui/StatusContent";

import { useDocument } from "entities/documents/hooks";
import { useChunks } from "entities/documentChunks/hooks";
import { useUpdateDocChunks } from "entities/documentChunks/hooks";
import { useDeleteDocChunks } from "entities/documentChunks/hooks";

import EditDocumentForm from "features/documents/ui/forms/EditDocumentForm";
import mdToast from "shared/ui/MDSnackbar/mdToast";

import { useCategories } from "entities/categories/hooks";
import { useSubcategories } from "entities/subcategories/hooks";

import { buildPrePayloadStrict } from "shared/libs/buildPrePayloadStrict";
import { arrayHandler } from "features/documents/hooks/useEditChunks";

import { selectCategoriesById } from "entities/categories/model";
import { selectSubcategoriesById } from "entities/subcategories/model";

const EditDocumentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1) Data
  const { data: documentData, isLoading: loadingDoc, error: errorDoc } = useDocument(id);
  const { data: chunksData, isLoading: loadingChunks, error: errorChunks } = useChunks(id);
  const { data: byIdCats } = useCategories({}, { select: selectCategoriesById });
  const { data: byIdSubcats } = useSubcategories({}, { select: selectSubcategoriesById });

  const isLoading = loadingDoc || loadingChunks;
  const error = errorDoc ?? errorChunks;

  // 2) Default values del form
  const defaultValues = useMemo(() => {
    if (!documentData || !byIdCats || !byIdSubcats) return {};
    return {
      category: documentData?.categoryId
        ? {
            id: documentData.categoryId,
            label: byIdCats[documentData.categoryId]?.name ?? "",
          }
        : null,
      subcategory: documentData?.subcategoryId
        ? {
            id: documentData.subcategoryId,
            label: byIdSubcats[documentData.subcategoryId]?.name ?? "",
          }
        : null,
      chunks: chunksData?.chunks ?? [],
    };
  }, [documentData, chunksData, byIdCats, byIdSubcats]);

  // 3) Mutación (hook react-query)
  const { mutateAsync: updateDocChunks, isPending: isPendingUpdate } = useUpdateDocChunks(id);
  const { mutateAsync: deleteDocChunks, isPending: isPendingDelete } = useDeleteDocChunks(id);

  // 4) Submit
  const handleSubmit = useCallback(
    async (dirtyFields, values, defaultValues) => {
      try {
        const patch = buildPrePayloadStrict(dirtyFields, values, defaultValues, { arrayHandler });
        if (!patch || Object.keys(patch).length === 0) {
          mdToast.info("No hay cambios para guardar.");
          return;
        }
        if (patch.chunks?.deletes?.length > 0) {
          await deleteDocChunks(patch.chunks.deletes);
        }
        if (patch.chunks?.updates?.length > 0) {
          await updateDocChunks(patch.chunks.updates);
        }
        mdToast.success("Documento actualizado correctamente.");
        navigate("/admin/documents");
      } catch (e) {
        mdToast.error(e?.message || "Error al actualizar el documento.");
      }
    },
    [defaultValues, deleteDocChunks, updateDocChunks, navigate]
  );

  return (
    <>
      <MDBox pb={3}>
        <Grid item xs={12}>
          <MDTypography variant="h4">Editar Documento</MDTypography>
        </Grid>
      </MDBox>

      <StatusContent isLoading={isLoading} error={error}>
        <EditDocumentForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isSubmitting={isPendingUpdate || isPendingDelete}
        />
      </StatusContent>
    </>
  );
};

export default EditDocumentPage;
