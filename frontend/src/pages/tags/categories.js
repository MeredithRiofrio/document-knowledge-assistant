import React, { useState, useCallback } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "shared/ui/MDBox";
import PageHeader from "shared/ui/PageHeader";

import CategoriesTable from "features/categories/ui/CategoriesTable";
import DeleteCatModal from "features/categories/ui/DeleteCatModal";
import UpsertCatModal from "features/categories/ui/UpsertCatModal";

import { useCategories } from "entities/categories/hooks";
import StatusContent from "shared/ui/StatusContent";

import { useSearchParams } from "react-router-dom";

const CategorySection = () => {
  const { data: categories, isLoading, error } = useCategories();
  const [toDelete, setToDelete] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const mode = searchParams.get("mode");
  const entity = searchParams.get("entity");
  const id = searchParams.get("id");
  const isUpsertOpen = Boolean(mode && entity === "category");
  const isEdit = mode === "edit";

  const closeUpsert = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete("entity");
    next.delete("mode");
    next.delete("id");
    setSearchParams(next, { replace: false });
  }, [searchParams, setSearchParams]);

  const openDelete = useCallback((category) => {
    setToDelete(category);
  }, []);
  const closeDelete = useCallback(() => setToDelete(null), []);

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <MDBox>
              <PageHeader
                title="Categorías"
                buttonLabel="Crear categoría"
                onButtonClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.set("entity", "category");
                  next.set("mode", "create");
                  next.delete("id");
                  setSearchParams(next);
                }}
              />
            </MDBox>

            <MDBox py={3}>
              <StatusContent isLoading={isLoading} error={error}>
                <CategoriesTable onDelete={openDelete} categories={categories ?? []} />
              </StatusContent>
            </MDBox>
          </Card>
        </Grid>
      </Grid>
      <DeleteCatModal open={!!toDelete} category={toDelete} onClose={closeDelete} />
      <UpsertCatModal
        open={isUpsertOpen}
        mode={isEdit ? "edit" : "create"}
        id={isEdit ? id : undefined}
        onClose={closeUpsert}
      />
    </>
  );
};

export default CategorySection;
