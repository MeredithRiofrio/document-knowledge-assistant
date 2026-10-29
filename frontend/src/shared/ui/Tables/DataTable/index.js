/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

import { useMemo, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useTable, usePagination, useGlobalFilter, useAsyncDebounce, useSortBy } from "react-table";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Icon from "@mui/material/Icon";
import Autocomplete from "@mui/material/Autocomplete";

import MDBox from "shared/ui/MDBox";
import MDTypography from "shared/ui/MDTypography";
import MDInput from "shared/ui/MDInput";
import MDPagination from "shared/ui/MDPagination";

import DataTableHeadCell from "./DataTableHeadCell";
import DataTableBodyCell from "./DataTableBodyCell";

function DataTable({
  entriesPerPage,
  canSearch,
  showTotalEntries,
  table,
  pagination,
  isSorted,
  noEndBorder,
}) {
  // --- Entries per page: opciones y default, estabilizados ---
  const entries = useMemo(() => {
    const xs =
      entriesPerPage && typeof entriesPerPage === "object" && Array.isArray(entriesPerPage.entries)
        ? entriesPerPage.entries
        : [5, 10, 15, 20, 25];
    return xs.map(String); // Autocomplete usa strings
  }, [entriesPerPage]);

  const defaultValue = useMemo(() => {
    const dv =
      entriesPerPage && typeof entriesPerPage === "object" && entriesPerPage.defaultValue != null
        ? entriesPerPage.defaultValue
        : 10;
    return Number.isFinite(dv) ? dv : 10;
  }, [entriesPerPage]);

  // --- Tabla: memos por columnas/filas, NO por el objeto table ---
  const columns = useMemo(() => table.columns, [table.columns]);
  const data = useMemo(() => table.rows, [table.rows]);

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0, globalFilter: "" } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    pageOptions,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = tableInstance;

  // --- Asegurar pageSize inicial solo si difiere ---
  useEffect(() => {
    if (pageSize !== defaultValue) setPageSize(defaultValue);
  }, [defaultValue, pageSize, setPageSize]);

  // --- Autocomplete: value siempre pertenece a options ---
  const autoValue = useMemo(() => {
    const v = String(pageSize);
    return entries.includes(v) ? v : entries[0];
  }, [entries, pageSize]);

  // Si el value válido difiere del pageSize actual, corrígelo sin ciclar
  useEffect(() => {
    const wanted = parseInt(autoValue, 10);
    if (pageSize !== wanted) setPageSize(wanted);
  }, [autoValue, pageSize, setPageSize]);

  const setEntriesPerPage = useCallback(
    (value) => {
      if (pageSize !== value) setPageSize(value);
    },
    [pageSize, setPageSize]
  );

  const handleSelectEntries = useCallback(
    (_, newValue) => {
      const n = parseInt(newValue, 10);
      if (Number.isFinite(n)) setEntriesPerPage(n);
    },
    [setEntriesPerPage]
  );

  // --- Búsqueda global ---
  const [search, setSearch] = useState(globalFilter);
  const onSearchChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 100);

  // --- Orden visual del encabezado ---
  const setSortedValue = (column) => {
    if (!isSorted) return false;
    if (column.isSorted) return column.isSortedDesc ? "desc" : "asce";
    return "none";
    // (ojo: "asce" es lo que usaba el template original)
  };

  // --- Paginación render ---
  const renderPagination = pageOptions.map((option) => (
    <MDPagination
      item
      key={option}
      onClick={() => gotoPage(Number(option))}
      active={pageIndex === option}
    >
      {option + 1}
    </MDPagination>
  ));

  const customizedPageOptions = pageOptions.map((o) => o + 1);

  const handleInputPagination = useCallback(
    ({ target: { value } }) => {
      const n = Number(value);
      if (!Number.isFinite(n)) return;
      if (n <= 0 || n > customizedPageOptions.length) gotoPage(0);
      else gotoPage(n - 1);
    },
    [customizedPageOptions.length, gotoPage]
  );

  // --- Rangos mostrados ---
  const entriesStart = pageIndex === 0 ? pageIndex + 1 : pageIndex * pageSize + 1;
  const entriesEnd =
    pageIndex === 0
      ? pageSize
      : pageIndex === pageOptions.length - 1
      ? rows.length
      : pageSize * (pageIndex + 1);

  return (
    <TableContainer sx={{ boxShadow: "none" }}>
      {(entriesPerPage || canSearch) && (
        <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
          {entriesPerPage && (
            <MDBox display="flex" alignItems="center">
              <Autocomplete
                disableClearable
                value={autoValue}
                options={entries}
                onChange={handleSelectEntries}
                size="small"
                sx={{ width: "5rem" }}
                renderInput={(params) => <MDInput {...params} />}
              />
              <MDTypography variant="caption" color="secondary">
                &nbsp;&nbsp;registros por página
              </MDTypography>
            </MDBox>
          )}

          {canSearch && (
            <MDBox width="12rem" ml="auto">
              <MDInput
                placeholder="Buscar..."
                value={search}
                size="small"
                fullWidth
                onChange={({ currentTarget }) => {
                  const v = currentTarget.value;
                  if (v !== search) {
                    setSearch(v);
                    onSearchChange(v);
                  }
                }}
              />
            </MDBox>
          )}
        </MDBox>
      )}

      <MDBox sx={{ overflowX: "auto" }}>
        <Table {...getTableProps()} sx={{ tableLayout: "fixed" }}>
          <MDBox component="thead">
            {headerGroups.map((headerGroup, key) => (
              <TableRow key={key} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, idx) => (
                  <DataTableHeadCell
                    key={idx}
                    {...column.getHeaderProps(isSorted && column.getSortByToggleProps())}
                    width={column.width ? column.width : "auto"}
                    align={column.align ? column.align : "left"}
                    sorted={setSortedValue(column)}
                  >
                    {column.render("Header")}
                  </DataTableHeadCell>
                ))}
              </TableRow>
            ))}
          </MDBox>

          <TableBody {...getTableBodyProps()}>
            {page.map((row, key) => {
              prepareRow(row);
              return (
                <TableRow key={key} {...row.getRowProps()}>
                  {row.cells.map((cell, idx) => (
                    <DataTableBodyCell
                      key={idx}
                      noBorder={noEndBorder && rows.length - 1 === key}
                      align={cell.column.align ? cell.column.align : "left"}
                      width={cell.column.width ? cell.column.width : "auto"}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </DataTableBodyCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </MDBox>

      <MDBox
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        p={!showTotalEntries && pageOptions.length === 1 ? 0 : 3}
      >
        {showTotalEntries && (
          <MDBox mb={{ xs: 3, sm: 0 }}>
            <MDTypography variant="button" color="secondary" fontWeight="regular">
              Mostrando {entriesStart} a {entriesEnd} de {rows.length} registros
            </MDTypography>
          </MDBox>
        )}

        {pageOptions.length > 1 && (
          <MDPagination
            variant={pagination.variant ? pagination.variant : "gradient"}
            color={pagination.color ? pagination.color : "info"}
          >
            {canPreviousPage && (
              <MDPagination item onClick={() => previousPage()}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
              </MDPagination>
            )}

            {renderPagination.length > 6 ? (
              <MDBox width="5rem" mx={1}>
                <MDInput
                  inputProps={{ type: "number", min: 1, max: customizedPageOptions.length }}
                  value={customizedPageOptions[pageIndex]}
                  onChange={handleInputPagination}
                />
              </MDBox>
            ) : (
              renderPagination
            )}

            {canNextPage && (
              <MDPagination item onClick={() => nextPage()}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
              </MDPagination>
            )}
          </MDPagination>
        )}
      </MDBox>
    </TableContainer>
  );
}

DataTable.defaultProps = {
  entriesPerPage: { defaultValue: 10, entries: [5, 10, 15, 20, 25] },
  canSearch: false,
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  isSorted: true,
  noEndBorder: false,
};

DataTable.propTypes = {
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.shape({
      defaultValue: PropTypes.number,
      entries: PropTypes.arrayOf(PropTypes.number),
    }),
    PropTypes.bool,
  ]),
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  table: PropTypes.objectOf(PropTypes.array).isRequired,
  pagination: PropTypes.shape({
    variant: PropTypes.oneOf(["contained", "gradient"]),
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
  }),
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
};

export default DataTable;
