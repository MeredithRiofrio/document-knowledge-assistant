import React, { useMemo } from "react";
import DataTable from "shared/ui/Tables/DataTable";
import PropTypes from "prop-types";
// Lógica y datos
import { getColumns } from "./configTable";

const CategoriesTable = ({ onDelete, categories }) => {
  const columns = useMemo(
    () =>
      getColumns({
        handleDelete: onDelete,
      }),
    [onDelete]
  );

  // asegura array, incluso si aún no carga
  const rows = useMemo(() => categories ?? [], [categories]);

  const table = useMemo(() => ({ columns, rows }), [columns, rows]);

  return <DataTable table={table} canSearch isSorted entriesPerPage showTotalEntries noEndBorder />;
};

CategoriesTable.propTypes = {
  onDelete: PropTypes.func.isRequired,
  categories: PropTypes.array,
};

export default CategoriesTable;
