// src/components/chunks/ChunksSection.jsx
import { useMemo } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";

// UI (Material Dashboard)
import MDBox from "shared/ui/MDBox";
import MDTypography from "shared/ui/MDTypography";
import Card from "@mui/material/Card";

// Wrapper de lista con búsqueda + paginación
import SmartList from "shared/ui/SmartList"; // ajusta la ruta
import ChunkItem from "../ChunkItem";

function ChunksSection() {
  const name = "chunks";

  const { control } = useFormContext();

  const { fields, remove } = useFieldArray({
    control,
    name,
    keyName: "key",
  });

  const values = useWatch({ control, name });

  const snapshot = useMemo(
    () =>
      fields.map((f, i) => ({
        key: f.key,
        id: f.id,
        i,
        text: values?.[i]?.text || "",
        onDelete: () => remove(i),
      })),
    [fields, values, remove]
  );

  return (
    <Card id="document-chunks">
      <MDBox p={4}>
        <MDBox pb={3}>
          <MDTypography variant="h6" fontWeight="medium">
            Información del Documento
          </MDTypography>
        </MDBox>

        <MDBox>
          <SmartList
            items={snapshot}
            selector={(x) => x.text}
            renderItem={(it, absIdx) => (
              <ChunkItem
                key={it.key}
                name={`${name}.${it.i}.text`}
                index={absIdx + 1}
                onDelete={it.onDelete}
              />
            )}
          />
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default ChunksSection;
