import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// MUI
import Icon from "@mui/material/Icon";

// Componentes del sistema
import MDBox from "shared/ui/MDBox";
import MDTypography from "shared/ui/MDTypography";
import MDButton from "shared/ui/MDButton";

function PageHeader({ title, buttonLabel, onButtonClick, buttonLink, icon = "add" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else if (buttonLink) {
      navigate(buttonLink);
    }
  };

  return (
    <MDBox
      mx={2}
      mt={-2}
      py={2.5}
      px={2.5}
      variant="gradient"
      bgColor="info"
      borderRadius="lg"
      coloredShadow="info"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      gap={2}
    >
      <MDTypography variant="h6" color="white">
        {title}
      </MDTypography>

      {buttonLabel && (onButtonClick || buttonLink) && (
        <MDButton variant="gradient" color="light" onClick={handleClick}>
          <Icon fontSize="small">{icon}</Icon>&nbsp;{buttonLabel}
        </MDButton>
      )}
    </MDBox>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string,
  onButtonClick: PropTypes.func,
  buttonLink: PropTypes.string,
  icon: PropTypes.string,
};

export default PageHeader;
