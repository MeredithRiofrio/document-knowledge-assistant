// features/documents/ui/forms/CreateDocumentForm.jsx
import React from "react";
import PropTypes from "prop-types";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import MDBox from "shared/ui/MDBox";
import SaveSection from "features/documents/fields/SaveSection";
import SelectorTags from "../../fields/SelectorTags";
import PdfSection from "../../fields/PdfSection";

import { createDocSchema } from "../../schemas/documentRules";

export default function CreateDocumentForm({ defaultValues, onSubmit, isSubmitting }) {
  const methods = useForm({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(createDocSchema),
  });

  const {
    handleSubmit,
    formState: { isDirty, isValid },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <MDBox>
          <MDBox mb={3}>
            <SelectorTags />
          </MDBox>

          <MDBox mb={3}>
            <PdfSection />
          </MDBox>

          <MDBox mb={5}>
            <SaveSection isDirty={isDirty} isValid={isValid} isSubmitting={isSubmitting} />
          </MDBox>
        </MDBox>
      </form>
    </FormProvider>
  );
}

CreateDocumentForm.propTypes = {
  defaultValues: PropTypes.shape({
    category: PropTypes.string,
    subcategory: PropTypes.string,
    file: PropTypes.any, // File | null
  }).isRequired,
  onSubmit: PropTypes.func.isRequired, // (values) => void
  isSubmitting: PropTypes.bool,
};

CreateDocumentForm.defaultProps = {
  isSubmitting: false,
};
