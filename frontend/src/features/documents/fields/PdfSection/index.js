// src/layouts/docsMutations/components/PdfSection/index.tsx
import { Controller, useFormContext } from "react-hook-form";
import Card from "@mui/material/Card";
import MDBox from "shared/ui/MDBox";
import MDTypography from "shared/ui/MDTypography";
import PdfDropUploader from "./PdfDropUploader";

function PdfSection() {
  const { control } = useFormContext();

  return (
    <Card>
      <MDBox p={3}>
        <MDBox py={1}>
          <MDTypography variant="h6" fontWeight="medium">
            Nuevo documento
          </MDTypography>
        </MDBox>

        <MDBox pt={2}>
          <Controller
            name="file"
            control={control}
            render={({ field, fieldState }) => (
              <PdfDropUploader
                file={field.value}
                onFileSelect={(f) => field.onChange(f)} // pasa File
                onBlur={field.onBlur}
                error={fieldState.error} // muestra mensaje del schema
                externalInputRef={field.ref}
              />
            )}
          />
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default PdfSection;
