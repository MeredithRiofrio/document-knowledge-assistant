// FreeSoloSelect.js
import React, { useEffect, useMemo, forwardRef } from "react";
import PropTypes from "prop-types";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "shared/ui/MDTypography";
import MDBox from "shared/ui/MDBox";
import HelperText from "shared/ui/HelperText";
import StatusContent from "shared/ui/StatusContent";

const FreeSoloSelect = forwardRef(function FreeSoloSelect(
  {
    entity,
    name,
    options,
    disabled = false,
    error = null,
    value,
    onChange,
    onBlur,
    info,
    loadingData,
    errorData,
  },
  ref
) {
  // value SIEMPRE objeto: { id: number|null, label: string }
  // Normalizamos options para evitar errores si llega undefined
  const safeOptions = Array.isArray(options) ? options : [];

  const optionById = useMemo(() => new Map(safeOptions.map((o) => [o.id, o])), [safeOptions]);

  // Si llega un id suelto por inicialización, normalízalo a objeto
  useEffect(() => {
    if (value && value.id && typeof value.label === "undefined") {
      const opt = optionById.get(value.id);
      if (opt) onChange({ id: opt.id, label: opt.label });
    }
  }, [value?.id, optionById, onChange]);

  const display = value?.label ?? "";

  return (
    <Grid item xs={12} md={6}>
      <Card>
        <MDBox pt={3} px={2}>
          <MDTypography variant="h6">{entity}s</MDTypography>
        </MDBox>
        <MDBox pt={2} pb={3} px={2}>
          <StatusContent isLoading={loadingData} error={errorData} height="150px">
            <Autocomplete
              options={safeOptions}
              freeSolo
              disabled={disabled}
              value={value ?? null}
              onChange={(e, newOption) => {
                if (!newOption) return onChange({ id: null, label: "" });
                onChange({
                  id: newOption.id,
                  label: newOption.label,
                });
              }}
              inputValue={display}
              onInputChange={(e, text, reason) => {
                if (reason !== "reset") onChange({ id: null, label: text });
              }}
              getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt?.label ?? "")}
              // isOptionEqualToValue={(opt, val) => opt.id === val?.id}
              renderOption={(props, option) => (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <li {...props} key={option.id}>
                  {option.label}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} name={name} error={!!error} onBlur={onBlur} inputRef={ref} />
              )}
            />
            <HelperText
              error={error}
              info={
                info ??
                (!error
                  ? disabled && entity?.toLowerCase() === "subcategoría"
                    ? "Primero seleccione una categoría"
                    : "Seleccione una opción existente o escriba para crear una nueva"
                  : "")
              }
              charCount={display.length}
              max={50}
              showCounter
            />
          </StatusContent>
        </MDBox>
      </Card>
    </Grid>
  );
});

FreeSoloSelect.propTypes = {
  entity: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.array,
  disabled: PropTypes.bool,
  error: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  info: PropTypes.string,
  loadingData: PropTypes.bool,
  errorData: PropTypes.object,
};

export default FreeSoloSelect;
