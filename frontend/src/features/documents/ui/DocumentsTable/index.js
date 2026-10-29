import React, { useMemo } from "react";
import PropTypes from "prop-types";
import DataTable from "shared/ui/Tables/DataTable";
import { getColumns } from "./configTable";

import { selectCategoriesById } from "entities/categories/model";
import { selectSubcategoriesById } from "entities/subcategories/model";

import { useCategories } from "entities/categories/hooks";
import { useSubcategories } from "entities/subcategories/hooks";

const DocumentsTable = ({ onDelete, documents }) => {
  const { data: catById } = useCategories({}, { select: selectCategoriesById });
  const { data: subById } = useSubcategories({}, { select: selectSubcategoriesById });

  const columns = useMemo(() => getColumns({ handleDelete: onDelete }), [onDelete]);

  const rows = useMemo(() => {
    const docs = documents ?? [];
    return docs.map((d) => {
      const categoryName = catById?.[d.categoryId]?.name ?? d.categoryName ?? "-";
      const subcategoryName = subById?.[d.subcategoryId]?.name ?? d.subcategoryName ?? "-";

      // conserva la MISMA referencia si no cambió nada visible
      if (d.categoryName === categoryName && d.subcategoryName === subcategoryName) {
        return d;
      }
      return { ...d, categoryName, subcategoryName };
    });
  }, [documents, catById, subById]);

  const table = useMemo(() => ({ columns, rows }), [columns, rows]);

  return <DataTable table={table} canSearch isSorted entriesPerPage showTotalEntries noEndBorder />;
};

DocumentsTable.propTypes = {
  onDelete: PropTypes.func.isRequired,
  documents: PropTypes.array,
};

export default DocumentsTable;
