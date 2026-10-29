/**
 * Toolbar por defecto usando componentes de Material Dashboard React
 * Recibe el estado desde SmartList por props (sin context para simplificar).
 */
import PropTypes from "prop-types";
import MDBox from "shared/ui/MDBox";
import MDInput from "shared/ui/MDInput";
import MDTypography from "shared/ui/MDTypography";
import Autocomplete from "@mui/material/Autocomplete";

export default function ToolbarDefault({
  query,
  setQuery,
  pageSize,
  setPageSize,
  pageSizeOptions,
  totalFiltered,
}) {
  return (
    <MDBox display="flex" alignItems="center" gap={2} flexWrap="wrap">
      <MDBox width={{ xs: "100%", sm: "16rem" }}>
        <MDInput
          placeholder="Buscar..."
          value={query}
          size="small"
          fullWidth
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar en la lista"
        />
      </MDBox>

      <MDBox display="flex" alignItems="center" gap={1} ml="auto">
        <MDTypography variant="caption" color="secondary">
          Por página
        </MDTypography>

        <Autocomplete
          disableClearable
          size="small"
          value={String(pageSize)}
          options={pageSizeOptions.map((n) => String(n))}
          onChange={(_, v) => setPageSize(Number(v))}
          sx={{ width: "6rem" }}
          renderInput={(params) => <MDInput {...params} />}
        />

        <MDTypography variant="caption" color="secondary">
          {totalFiltered} resultados
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

ToolbarDefault.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
  setPageSize: PropTypes.func.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
  totalFiltered: PropTypes.number.isRequired,
};
