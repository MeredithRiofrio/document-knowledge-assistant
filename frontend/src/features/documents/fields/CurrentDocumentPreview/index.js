import React from "react";
import PropTypes from "prop-types";
import MDBox from "shared/ui/MDBox";
import MDTypography from "shared/ui/MDTypography";
import StatusContent from "shared/ui/StatusContent";

const CurrentDocumentPreview = ({ isLoading, error, text }) => {
  return (
    <MDBox>
      <MDBox py={1}>
        <MDTypography variant="h6" fontWeight="medium">
          Documento Actual
        </MDTypography>
      </MDBox>

      <StatusContent isLoading={isLoading} error={error} height="400px">
        <MDBox pt={3} sx={{ maxHeight: "400px", overflowY: "auto" }}>
          <MDTypography variant="body2" whiteSpace="pre-line">
            {text}
          </MDTypography>
        </MDBox>
      </StatusContent>
    </MDBox>
  );
};

CurrentDocumentPreview.defaultProps = {
  isLoading: false,
  text: "",
  error: null,
};

CurrentDocumentPreview.propTypes = {
  isLoading: PropTypes.bool,
  text: PropTypes.string,
  error: PropTypes.object,
};

export default CurrentDocumentPreview;
