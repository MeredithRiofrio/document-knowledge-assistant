import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";

// MUI
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

// Componentes
import MDBox from "shared/ui/MDBox";
import MDTypography from "shared/ui/MDTypography";
import HelperText from "shared/ui/HelperText";

/* eslint-disable react/jsx-props-no-spreading */
function PdfDropUploader({ file, onFileSelect, error, externalInputRef }) {
  const [pdfUrl, setPdfUrl] = useState(null);

  const { getRootProps, getInputProps, inputRef } = useDropzone({
    onDrop: (acceptedFiles) => {
      const pdfFile = acceptedFiles[0];
      if (!pdfFile) return;

      if (pdfFile.type !== "application/pdf") {
        alert("Solo se permiten archivos PDF.");
        return;
      }

      onFileSelect(pdfFile);
    },
    accept: { "application/pdf": [] },
    multiple: false,
  });

  // ✅ Conectar el ref del input de dropzone al ref de react-hook-form
  useEffect(() => {
    if (externalInputRef && inputRef.current) {
      if (typeof externalInputRef === "function") {
        externalInputRef(inputRef.current);
      } else {
        externalInputRef.current = inputRef.current;
      }
    }
  }, [externalInputRef, inputRef]);

  // ✅ Crea y limpia la URL del PDF
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPdfUrl(null);
    }
  }, [file]);

  return (
    <MDBox>
      {!pdfUrl ? (
        <MDBox
          {...getRootProps()}
          sx={{
            p: 3,
            mb: 1,
            border: "2px dashed",
            borderColor: error ? "red" : "#90caf9",
            borderRadius: "8px",
            textAlign: "center",
            cursor: "pointer",
            position: "relative",
          }}
        >
          {/* ✅ No uses ref directamente */}
          <input
            {...getInputProps()}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer",
              zIndex: 1,
            }}
          />
          <MDTypography variant="body1" color={error ? "error" : "inherit"}>
            Arrastra y suelta un archivo <strong>PDF</strong> aquí, o haz clic para seleccionarlo.
          </MDTypography>
        </MDBox>
      ) : (
        <MDBox position="relative">
          <IconButton
            onClick={() => onFileSelect(null)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 2,
              backgroundColor: "rgba(255,255,255,0.9)",
              "&:hover": { backgroundColor: "#f8d7da" },
            }}
          >
            <CloseIcon />
          </IconButton>

          <MDBox
            component="iframe"
            src={pdfUrl}
            width="100%"
            height="500px"
            sx={{ border: "1px solid #ccc", borderRadius: "8px" }}
          />
        </MDBox>
      )}

      <HelperText error={error} showCounter={false} />
    </MDBox>
  );
}

PdfDropUploader.propTypes = {
  file: PropTypes.any,
  onFileSelect: PropTypes.func,
  error: PropTypes.object,
  externalInputRef: PropTypes.any,
};

export default PdfDropUploader;
