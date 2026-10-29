import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formEditSchema } from "../../schemas/documentRules";

import MDBox from "shared/ui/MDBox";
import SaveSection from "features/documents/fields/SaveSection";

// OJO: importa de shared si es compartido entre features:
import SelectorTags from "../../fields/SelectorTags";
import ChunksSection from "../../fields/ChunksSection";

export default function EditDocumentForm({ defaultValues, onSubmit, isSubmitting }) {
  const methods = useForm({
    mode: "onChange",
    defaultValues,
    resolver: zodResolver(formEditSchema),
  });

  const {
    handleSubmit,
    formState: { isDirty, isValid, dirtyFields },
    reset,
  } = methods;

  useEffect(() => {
    reset(defaultValues, { keepDirty: false });
  }, [defaultValues, reset]);

  return (
    <FormProvider {...methods}>
      <MDBox
        component="form"
        onSubmit={handleSubmit((values) => onSubmit(dirtyFields, values, defaultValues))}
        noValidate
      >
        {/* Estas secciones ya llevan su propio Controller + useFormContext
        <MDBox mb={3}>
          <SelectorTags />
        </MDBox> */}

        <MDBox mb={3}>
          <ChunksSection />
        </MDBox>

        <MDBox mb={5}>
          <SaveSection isDirty={isDirty} isValid={isValid} isSubmitting={isSubmitting} />
        </MDBox>
      </MDBox>
    </FormProvider>
  );
}

EditDocumentForm.propTypes = {
  defaultValues: PropTypes.shape({
    category: PropTypes.object,
    subcategory: PropTypes.object,
    chunks: PropTypes.array,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired, // (values) => void
  isSubmitting: PropTypes.bool,
};

EditDocumentForm.defaultProps = {
  isSubmitting: false,
};
