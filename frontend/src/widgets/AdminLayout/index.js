// src/widgets/AdminLayout/index.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import DashboardLayout from "widgets/LayoutContainers/DashboardLayout";
import DashboardNavbar from "widgets/Navbars/DashboardNavbar";
import Footer from "shared/ui/Footer";

import Sidenav from "widgets/Sidenav";
import Configurator from "widgets/LayoutTools/Configurator";
import MDBox from "shared/ui/MDBox";
import Icon from "@mui/material/Icon";

import navRoutes from "./navRoutes";
import brandWhite from "shared/assets/images/logo-ct.png";
import brandDark from "shared/assets/images/logo-ct-dark.png";

import {
  useMaterialUIController,
  setMiniSidenav,
  setOpenConfigurator,
} from "app/providers/MaterialUIContext";

export default function AdminLayout() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);

  const brand = (transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite;

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  return (
    <DashboardLayout>
      <Sidenav
        color={sidenavColor}
        brand={brand}
        brandName="Knowledge Desk"
        routes={navRoutes}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      />
      <Configurator />

      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="3.25rem"
        height="3.25rem"
        bgColor="white"
        shadow="sm"
        borderRadius="50%"
        position="fixed"
        right="2rem"
        bottom="2rem"
        zIndex={99}
        color="dark"
        sx={{ cursor: "pointer" }}
        onClick={handleConfiguratorOpen}
      >
        <Icon fontSize="small" color="inherit">
          settings
        </Icon>
      </MDBox>

      {/* Navbar + contenido + footer */}
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Outlet />
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
