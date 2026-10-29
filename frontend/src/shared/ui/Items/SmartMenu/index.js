import PropTypes from "prop-types";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mui/material/Icon";
import MDTypography from "shared/ui/MDTypography";
import MDBox from "shared/ui/MDBox";
import Link from "@mui/material/Link";

// El menú completo: recibe anchorEl, open, onClose, y opciones
function SmartMenu({ anchorEl, open, onClose, options = [] }) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      {options.map(({ icon, title, action }) => (
        <MenuItem
          key={title}
          onClick={() => {
            onClose(); // cerrar el menú al hacer click
            action();
          }}
        >
          <MDBox component={Link} py={0.5} display="flex" alignItems="center" lineHeight={1}>
            {icon && (
              <MDTypography variant="body1" color="secondary" lineHeight={0.75}>
                <Icon>{icon}</Icon>
              </MDTypography>
            )}
            <MDTypography variant="button" fontWeight="regular" sx={{ ml: icon ? 1 : 0 }}>
              {title}
            </MDTypography>
          </MDBox>
        </MenuItem>
      ))}
    </Menu>
  );
}

SmartMenu.propTypes = {
  anchorEl: PropTypes.any,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      title: PropTypes.string.isRequired,
      action: PropTypes.func.isRequired,
    })
  ).isRequired,
};

export default SmartMenu;
