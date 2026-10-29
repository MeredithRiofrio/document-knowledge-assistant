import React, { useMemo, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { useFormContext, Controller } from "react-hook-form";
import FreeSoloSelect from "./FreeSoloSelect";

import { useCategories } from "entities/categories/hooks";
import { useSubcategories } from "entities/subcategories/hooks";

import { selectCategoryOptions } from "entities/categories/model";
import { selectSubOptionsByCategoryId } from "entities/subcategories/model";

const EMPTY = Object.freeze([]);

function SelectorTags() {
  const { control, watch, setValue } = useFormContext();
  // el form guarda { id, label }
  const category = watch("category");
  const categoryId = category?.id ?? null;

  const {
    data: categoryOptions, // [{ id, label }]
    isLoading: loadingCategories,
    error: errorCategories,
  } = useCategories({}, { select: selectCategoryOptions });

  const {
    data: optionsByCategoryId, // { [catId]: [{ id, label }] }
    isLoading: loadingSubcategories,
    error: errorSubcategories,
  } = useSubcategories({}, { select: selectSubOptionsByCategoryId });

  // ⬇️ opciones dependientes por categoría (misma ref si no hay)
  const subcategoryOptions = useMemo(() => {
    if (!categoryId) return EMPTY;
    return optionsByCategoryId[String(categoryId)] ?? EMPTY; // clave como string
  }, [categoryId, optionsByCategoryId]);

  // reset subcategoría al cambiar de categoría
  useEffect(() => {
    setValue("subcategory", { id: null, label: "" }, { shouldDirty: true, shouldValidate: true });
  }, [categoryId, setValue]);

  const subcategoryDisabled = !category;

  return (
    <Grid container spacing={3}>
      <Controller
        name="category"
        control={control}
        render={({ field, fieldState }) => (
          <FreeSoloSelect
            entity="Categoría"
            {...field}
            options={categoryOptions}
            error={fieldState.error}
            loadingData={loadingCategories}
            errorData={errorCategories}
          />
        )}
      />

      <Controller
        name="subcategory"
        control={control}
        render={({ field, fieldState }) => (
          <FreeSoloSelect
            entity="Subcategoría"
            {...field}
            options={subcategoryOptions}
            disabled={subcategoryDisabled}
            error={fieldState.error}
            info={!subcategoryDisabled ? undefined : "Primero seleccione una categoría"}
            loadingData={loadingSubcategories}
            errorData={errorSubcategories}
          />
        )}
      />
    </Grid>
  );
}

export default SelectorTags;
