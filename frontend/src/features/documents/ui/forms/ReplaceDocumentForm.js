import React from "react";
import PropTypes from "prop-types";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import MDBox from "shared/ui/MDBox";
import SaveSection from "features/documents/fields/SaveSection";
import PdfSection from "../../fields/PdfSection";

import { formReplaceSchema } from "../../schemas/documentRules";

export default function ReplaceDocumentForm({ defaultValues, onSubmit, isSubmitting }) {
  const methods = useForm({
    mode: "onChange",
    resolver: zodResolver(formReplaceSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isDirty, isValid },
    watch,
  } = methods;

  // opcional: si querés usarlo para habilitar/deshabilitar visualmente
  const selectedFile = watch("file");

  return (
    <FormProvider {...methods}>
      <MDBox component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <MDBox mb={3}>
          {/* PdfSection se registra sola con RHF internamente */}
          <PdfSection name="file" />
        </MDBox>

        <MDBox mb={5}>
          <SaveSection
            isDirty={isDirty}
            // Si confiás 100% en Zod:
            // isValid={isValid}
            // Si quieres un guard visual adicional:
            isValid={isValid && !!selectedFile}
            isSubmitting={isSubmitting}
          />
        </MDBox>
      </MDBox>
    </FormProvider>
  );
}

ReplaceDocumentForm.propTypes = {
  defaultValues: PropTypes.shape({
    file: PropTypes.any, // File | null
  }),
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

ReplaceDocumentForm.defaultProps = {
  defaultValues: { file: null },
  isSubmitting: false,
};
