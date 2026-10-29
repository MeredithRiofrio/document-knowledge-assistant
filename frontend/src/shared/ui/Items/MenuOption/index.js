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

import { forwardRef } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import MenuItem from "@mui/material/MenuItem";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "shared/ui/MDBox";
import MDTypography from "shared/ui/MDTypography";

// custom styles for the MenuOption
import menuItem from "shared/ui/Items/MenuOption/styles";

const MenuOption = forwardRef(({ icon, title, ...rest }, ref) => (
  <MenuItem {...rest} ref={ref} sx={(theme) => menuItem(theme)}>
    <MDBox component={Link} py={0.5} display="flex" alignItems="center" lineHeight={1}>
      <MDTypography variant="body1" color="secondary" lineHeight={0.75}>
        {icon && (
          <MDTypography variant="body1" color="secondary" lineHeight={0.75}>
            <Icon>{icon}</Icon>
          </MDTypography>
        )}
      </MDTypography>
      <MDTypography variant="button" fontWeight="regular" sx={{ ml: icon ? 1 : 0 }}>
        {title}
      </MDTypography>
    </MDBox>
  </MenuItem>
));

// Typechecking props for the MenuOption
MenuOption.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default MenuOption;
