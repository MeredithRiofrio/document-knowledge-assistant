import React, { useMemo } from "react";
import PropTypes from "prop-types";
import DataTable from "shared/ui/Tables/DataTable";
import { getColumns } from "./configTable";

import { selectCategoriesById } from "entities/categories/model";
import { useCategories } from "entities/categories/hooks";

const SubcategoriesTable = ({ onDelete, subcategories }) => {
  const { data: catById } = useCategories({}, { select: selectCategoriesById });

  const columns = useMemo(
    () =>
      getColumns({
        handleDelete: onDelete,
      }),
    [onDelete]
  );

  const rows = useMemo(() => {
    const subcats = subcategories ?? [];
    return subcats.map((s) => {
      const categoryName = catById?.[s.categoryId]?.name ?? s.categoryName ?? "-";

      // conserva la MISMA referencia si no cambió nada visible
      if (s.categoryName === categoryName) {
        return s;
      }
      return { ...s, categoryName };
    });
  }, [subcategories, catById]);

  const table = useMemo(() => ({ columns, rows }), [columns, rows]);

  return <DataTable table={table} canSearch isSorted entriesPerPage showTotalEntries noEndBorder />;
};

SubcategoriesTable.propTypes = {
  onDelete: PropTypes.func.isRequired,
  subcategories: PropTypes.array,
};

export default SubcategoriesTable;
