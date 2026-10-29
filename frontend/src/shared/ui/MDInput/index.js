import { forwardRef } from "react";
import PropTypes from "prop-types";
import InputAdornment from "@mui/material/InputAdornment";
import ErrorIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Custom styles for MDInput
import MDInputRoot from "shared/ui/MDInput/MDInputRoot";

const MDInput = forwardRef(({ error, success, disabled, InputProps = {}, ...rest }, ref) => {
  let adornment = null;

  if (error) {
    adornment = (
      <InputAdornment position="end">
        <ErrorIcon color="error" fontSize="small" />
      </InputAdornment>
    );
  } else if (success) {
    adornment = (
      <InputAdornment position="end">
        <CheckCircleIcon color="success" fontSize="small" />
      </InputAdornment>
    );
  }

  return (
    <MDInputRoot
      {...rest}
      ref={ref}
      InputProps={{
        ...InputProps,
        endAdornment: adornment,
      }}
      ownerState={{ error, success, disabled }}
    />
  );
});

MDInput.defaultProps = {
  error: false,
  success: false,
  disabled: false,
};

MDInput.propTypes = {
  error: PropTypes.bool,
  success: PropTypes.bool,
  disabled: PropTypes.bool,
  InputProps: PropTypes.object,
};

export default MDInput;
