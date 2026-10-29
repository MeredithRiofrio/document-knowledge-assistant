import PropTypes from "prop-types";
import { FormProvider, useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import MDBox from "shared/ui/MDBox";
import MDInput from "shared/ui/MDInput";
import HelperText from "shared/ui/HelperText";
import { subcategorySchema } from "./subcategorySchema";

// utils/normalize.js
export const normalize = (v) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ") : "");

export default function SubcategoryForm({ defaultValues, options, onSubmit, formId, isEdit }) {
  const methods = useForm({
    resolver: zodResolver(subcategorySchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = methods;

  useEffect(() => {
    reset(defaultValues, { keepDirty: false });
  }, [defaultValues, reset]);

  const name = useWatch({ control, name: "name" });
  const listOptions = options ?? [];

  return (
    <FormProvider {...methods}>
      <form
        id={formId}
        noValidate
        onSubmit={handleSubmit((values) => onSubmit(dirtyFields, values, defaultValues))}
      >
        <MDBox display="flex" flexDirection="column">
          <MDBox pb={5}>
            <Controller
              name="categoryId"
              control={control}
              render={({ field, fieldState }) => {
                const selected = listOptions.find((o) => o.id === field.value) || null;
                return (
                  <>
                    <Autocomplete
                      disabled={isEdit}
                      options={listOptions}
                      getOptionLabel={(opt) => opt?.label || ""}
                      isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
                      value={selected}
                      onChange={(_e, newValue) => field.onChange(newValue?.id ?? "")}
                      onBlur={field.onBlur}
                      fullWidth
                      renderOption={(props, option) => (
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        <li {...props} key={option.id}>
                          {option.label}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Seleccione una Categoría" />
                      )}
                    />
                    <HelperText error={fieldState.error} showCounter={false} />
                  </>
                );
              }}
            />
          </MDBox>

          <MDInput
            label="Nombre"
            placeholder="Nombre de la subcategoría"
            fullWidth
            autoFocus
            inputProps={{ maxLength: 50 }}
            {...register("name", { setValueAs: normalize })}
            error={Boolean(errors?.name)}
          />
          <HelperText error={errors.name} charCount={name?.length || 0} max={50} />
        </MDBox>
      </form>
    </FormProvider>
  );
}

SubcategoryForm.defaultProps = {
  options: [],
  defaultValues: { name: "", categoryId: "" },
  isEdit: false,
};

SubcategoryForm.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
    })
  ),
  defaultValues: PropTypes.shape({
    name: PropTypes.string,
    categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onSubmit: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  isEdit: PropTypes.bool,
};
