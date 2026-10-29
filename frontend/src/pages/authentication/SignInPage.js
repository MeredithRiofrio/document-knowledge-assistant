import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React, { useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSignIn } from "./authRules";

// @mui material components
import Card from "@mui/material/Card";
import { CircularProgress } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "shared/ui/MDBox";
import MDTypography from "shared/ui/MDTypography";
import MDInput from "shared/ui/MDInput";
import MDButton from "shared/ui/MDButton";
import mdToast from "shared/ui/MDSnackbar/mdToast";
import HelperText from "shared/ui/HelperText";

// Authentication layout components
import BasicLayout from "widgets/authentication/BasicLayout";

// Images
import bgImage from "shared/assets/images/bg-sign-in-basic.jpeg";

import { useLogin } from "entities/users/hooks";

function Basic() {
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    resolver: zodResolver(createSignIn),
  });

  const {
    formState: { errors, isDirty, isValid },
  } = methods;

  // 3) Mutación (hook react-query)
  const { mutateAsync: login, isPending } = useLogin();

  const handleSubmit = useCallback(
    async (values) => {
      try {
        await login(values);
        mdToast.success("Inicio de sesión exitoso.");
        navigate("/admin/documents");
      } catch (e) {
        mdToast.error(e?.message || "Error al iniciar sesión.");
      }
    },
    [login, navigate]
  );

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Iniciar Sesión
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <FormProvider {...methods}>
            <MDBox component="form" role="form" onSubmit={methods.handleSubmit(handleSubmit)}>
              <MDBox mb={2}>
                <MDInput
                  type="email"
                  label="Correo"
                  variant="standard"
                  fullWidth
                  {...methods.register("email")}
                />
                <HelperText error={errors.email} showCounter={false} />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="password"
                  label="Contraseña"
                  variant="standard"
                  fullWidth
                  {...methods.register("password")}
                />
                <HelperText error={errors.password} showCounter={false} />
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  disabled={!isDirty || !isValid || isPending}
                  type="submit"
                >
                  {isPending ? (
                    <>
                      <CircularProgress size={20} color="inherit" />
                      &nbsp; Cargando...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </MDButton>
              </MDBox>
            </MDBox>
          </FormProvider>
          <MDBox mt={3} mb={1} textAlign="center">
            <MDTypography variant="button" color="text">
              ¿No tienes cuenta aún?{" "}
              <MDTypography
                component={Link}
                to="/authentication/sign-up"
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
              >
                Regístrate
              </MDTypography>
            </MDTypography>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
