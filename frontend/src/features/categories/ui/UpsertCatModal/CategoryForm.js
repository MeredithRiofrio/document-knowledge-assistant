import PropTypes from "prop-types";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import MDBox from "shared/ui/MDBox";
import MDInput from "shared/ui/MDInput";
import HelperText from "shared/ui/HelperText";
import { categorySchema } from "./categorySchema";

export default function CategoryForm({ defaultValues, onSubmit, formId }) {
  const methods = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = methods;

  useEffect(() => {
    reset(defaultValues, { keepDirty: false });
  }, [defaultValues, reset]);

  const name = useWatch({ control, name: "name" });

  return (
    <FormProvider {...methods}>
      <form
        id={formId}
        noValidate
        onSubmit={handleSubmit((values) => onSubmit(dirtyFields, values, defaultValues))}
      >
        <MDBox display="flex" flexDirection="column">
          <MDInput
            placeholder="Nombre de la Categoría"
            error={Boolean(errors?.name)}
            {...register("name")}
          />
          <HelperText error={errors.name} charCount={name?.length || 0} max={50} />
        </MDBox>
      </form>
    </FormProvider>
  );
}

CategoryForm.defaultProps = {
  defaultValues: { name: "" },
};

CategoryForm.propTypes = {
  defaultValues: PropTypes.shape({
    name: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
};
