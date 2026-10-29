/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

export default styled(TextField)(({ theme, ownerState }) => {
  const { palette, functions } = theme;
  const { error, success, disabled } = ownerState;

  const { grey, transparent, error: colorError, success: colorSuccess } = palette;
  const { pxToRem } = functions;

  // styles for the input with error={true}
  const errorStyles = () => ({
    "& .Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline, &:after": {
        borderColor: colorError.main,
      },
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: colorError.main,
    },
  });

  // styles for the input with success={true}
  const successStyles = () => ({
    "& .Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline, &:after": {
        borderColor: colorSuccess.main,
      },
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: colorSuccess.main,
    },
  });

  return {
    backgroundColor: disabled ? `${grey[200]} !important` : transparent.main,
    pointerEvents: disabled ? "none" : "auto",
    ...(error && errorStyles()),
    ...(success && successStyles()),

    "& .MuiFormHelperText-root": {
      marginTop: pxToRem(10), // o simplemente "10px"
      fontSize: pxToRem(12),
      color: error ? colorError.main : grey[700],
    },
  };
});
