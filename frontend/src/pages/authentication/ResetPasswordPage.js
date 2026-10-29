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
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "shared/ui/MDBox";
import MDTypography from "shared/ui/MDTypography";
import MDInput from "shared/ui/MDInput";
import MDButton from "shared/ui/MDButton";

// Authentication layout components
import CoverLayout from "widgets/authentication/CoverLayout";

// Images
import bgImage from "shared/assets/images/bg-reset-cover.jpeg";

function Cover() {
  return (
    <CoverLayout coverHeight="50vh" image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          py={2}
          mb={1}
          textAlign="center"
        >
          <MDBox p={2}>
            <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
              Recuperar Contraseña
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              Recibirás un correo en un máximo de 60 segundos
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={4}>
              <MDInput type="email" label="Correo" variant="standard" fullWidth />
            </MDBox>
            <MDBox mt={6} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth>
                Enviar
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
