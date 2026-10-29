// SubcategorySection.jsx
import React, { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "shared/ui/MDBox";
import PageHeader from "shared/ui/PageHeader";
import StatusContent from "shared/ui/StatusContent";

import SubcategoriesTable from "features/subcategories/ui/SubcategoriesTable";
import DeleteSubcatModal from "features/subcategories/ui/DeleteSubcatModal";
import UpsertSubcatModal from "features/subcategories/ui/UpsertSubcatModal";

import { useSubcategories } from "entities/subcategories/hooks";

const SubcategorySection = () => {
  const { data: subcategories, isLoading, error } = useSubcategories();
  const [toDelete, setToDelete] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const entity = searchParams.get("entity");
  const id = searchParams.get("id");
  const isUpsertOpen = Boolean(mode && entity === "subcategory");
  const isEdit = mode === "edit";

  const closeUpsert = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete("entity");
    next.delete("mode");
    next.delete("id");
    setSearchParams(next, { replace: false });
  }, [searchParams, setSearchParams]);

  const openDelete = useCallback((subcategory) => {
    setToDelete(subcategory);
  }, []);

  const closeDelete = useCallback(() => setToDelete(null), []);

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <MDBox>
              <PageHeader
                title="Subcategorías"
                buttonLabel="Crear subcategoría"
                onButtonClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.set("entity", "subcategory");
                  next.set("mode", "create");
                  next.delete("id");
                  setSearchParams(next);
                }}
              />
            </MDBox>

            <MDBox py={3}>
              <StatusContent isLoading={isLoading} error={error}>
                <SubcategoriesTable subcategories={subcategories ?? []} onDelete={openDelete} />
              </StatusContent>
            </MDBox>
          </Card>
        </Grid>
      </Grid>

      <DeleteSubcatModal open={!!toDelete} subcategory={toDelete} onClose={closeDelete} />

      <UpsertSubcatModal
        open={isUpsertOpen}
        mode={isEdit ? "edit" : "create"}
        id={isEdit ? id : undefined}
        onClose={closeUpsert}
      />
    </>
  );
};

export default SubcategorySection;
