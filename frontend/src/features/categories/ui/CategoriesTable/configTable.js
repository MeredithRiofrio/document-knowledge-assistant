// src/layouts/tagsLists/CategoryTable/utils/configTable.js
import CategoryActionsCell, { CategoryNameCell, SubcategoryCountCell } from "./TableCells";

export const getColumns = ({ handleDelete, isLoading }) => [
  {
    Header: "Categorías",
    accessor: "name",
    align: "left",
    Cell: CategoryNameCell,
  },
  {
    Header: "Cantidad Subcategorías",
    accessor: "subcategoryCount",
    align: "center",
    Cell: SubcategoryCountCell,
  },
  {
    Header: "Acciones",
    accessor: "actions",
    align: "center",
    Cell: (props) => (
      <CategoryActionsCell {...props} onDelete={handleDelete} isLoading={isLoading} />
    ),
  },
];
