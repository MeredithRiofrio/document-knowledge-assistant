import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React, { useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSignUp } from "./authRules";

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
import CoverLayout from "widgets/authentication/CoverLayout";

// Images
import bgImage from "shared/assets/images/bg-sign-up-cover.jpeg";

import { useRegister } from "entities/users/hooks";

function Cover() {
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    resolver: zodResolver(createSignUp),
  });

  const {
    formState: { errors, isDirty, isValid },
  } = methods;

  // 3) Mutación (hook react-query)
  const { mutateAsync: createUser, isPending } = useRegister();

  const handleSubmit = useCallback(
    async (values) => {
      try {
        await createUser(values);
        mdToast.success("Usuario creado correctamente.");
        navigate("/authentication/sign-in");
      } catch (e) {
        mdToast.error(e?.message || "Error al crear usuario.");
      }
    },
    [createUser, navigate]
  );

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Regístrate
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
                      &nbsp; Creando...
                    </>
                  ) : (
                    "Crear Cuenta"
                  )}
                </MDButton>
              </MDBox>
            </MDBox>
          </FormProvider>
          <MDBox mt={3} mb={1} textAlign="center">
            <MDTypography variant="button" color="text">
              ¿Ya tienes una cuenta?{" "}
              <MDTypography
                component={Link}
                to="/authentication/sign-in"
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
              >
                Iniciar Sesión
              </MDTypography>
            </MDTypography>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
