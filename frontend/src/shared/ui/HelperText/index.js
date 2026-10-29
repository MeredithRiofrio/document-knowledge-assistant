// src/components/Form/HelperText.js
import PropTypes from "prop-types";
import React from "react";
import MDBox from "shared/ui/MDBox";
import MDTypography from "shared/ui/MDTypography";

function HelperText({ error, info = "", charCount = 0, max = 4000, showCounter = true }) {
  const isOverLimit = charCount > max;

  return (
    <MDBox display="flex" justifyContent="space-between" alignItems="center" mt={1}>
      <MDBox minHeight="1.25rem">
        {error?.message ? (
          <MDTypography variant="caption" color="error">
            {error.message}
          </MDTypography>
        ) : info ? (
          <MDTypography variant="caption" color="text">
            {info}
          </MDTypography>
        ) : null}
      </MDBox>

      {showCounter && (
        <MDTypography variant="caption" color={isOverLimit ? "error" : "text"}>
          {charCount} / {max}
        </MDTypography>
      )}
    </MDBox>
  );
}

HelperText.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  info: PropTypes.string,
  charCount: PropTypes.number,
  max: PropTypes.number,
  showCounter: PropTypes.bool,
};

export default HelperText;
