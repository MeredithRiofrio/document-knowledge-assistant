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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "shared/ui/MDBox";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "app/providers/MaterialUIContext";
import SvgIcon from "@mui/material/SvgIcon";

function DataTableHeadCell({ width, children, sorted, align, ...rest }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <MDBox
      component="th"
      width={width}
      py={1.5}
      px={3}
      sx={({ palette: { light }, borders: { borderWidth } }) => ({
        borderBottom: `${borderWidth[1]} solid ${light.main}`,
      })}
    >
      <MDBox
        {...rest}
        display="flex"
        flexDirection="row"
        justifyContent={align === "center" ? "center" : "space-between"}
        textAlign={align}
        alignItems="center"
        color={darkMode ? "white" : "secondary"}
        opacity={0.7}
        sx={({ typography: { size, fontWeightBold } }) => ({
          fontSize: size.xxs,
          fontWeight: fontWeightBold,
          textTransform: "uppercase",
          cursor: sorted ? "pointer" : "default",
          userSelect: sorted && "none",
          wordBreak: "break-word",
          overflowWrap: "break-word",
        })}
      >
        {/* Mostrar íconos primero si está alineado a la derecha */}
        {align === "right" && sorted && (
          <MDBox
            ml={1}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <SvgIcon
              viewBox="0 0 10 6"
              fontSize="medium"
              sx={{
                fontSize: "8px",
                color: sorted === "asce" ? "text.main" : "secondary.main",
                opacity: sorted === "asce" ? 1 : 0.5,
              }}
            >
              <path d="M0 6L5 0L10 6H0Z" />
            </SvgIcon>
            <SvgIcon
              viewBox="0 0 10 6"
              fontSize="medium"
              sx={{
                fontSize: "8px",
                color: sorted === "desc" ? "text.main" : "secondary.main",
                opacity: sorted === "desc" ? 1 : 0.5,
              }}
            >
              <path d="M0 0L5 6L10 0H0Z" />
            </SvgIcon>
          </MDBox>
        )}

        {/* Texto */}
        {children}

        {/* Mostrar íconos después si NO está alineado a la derecha */}
        {align !== "right" && sorted && (
          <MDBox
            ml={1}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <SvgIcon
              viewBox="0 0 10 6"
              fontSize="medium"
              sx={{
                fontSize: "8px",
                color: sorted === "asce" ? "text.main" : "secondary.main",
                opacity: sorted === "asce" ? 1 : 0.5,
              }}
            >
              <path d="M0 6L5 0L10 6H0Z" />
            </SvgIcon>
            <SvgIcon
              viewBox="0 0 10 6"
              fontSize="medium"
              sx={{
                fontSize: "8px",
                color: sorted === "desc" ? "text.main" : "secondary.main",
                opacity: sorted === "desc" ? 1 : 0.5,
              }}
            >
              <path d="M0 0L5 6L10 0H0Z" />
            </SvgIcon>
          </MDBox>
        )}
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of DataTableHeadCell
DataTableHeadCell.defaultProps = {
  width: "auto",
  sorted: "none",
  align: "left",
};

// Typechecking props for the DataTableHeadCell
DataTableHeadCell.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node.isRequired,
  sorted: PropTypes.oneOf([false, "none", "asce", "desc"]),
  align: PropTypes.oneOf(["left", "right", "center"]),
};

export default DataTableHeadCell;
