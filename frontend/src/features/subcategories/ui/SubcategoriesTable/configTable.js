// src/layouts/tagsLists/SubcategoryTable/utils/configTable.js
import SubcategoryActionsCell, { SubcategoryNameCell, ParentCategoryCell } from "./TableCells";

export const getColumns = ({ handleDelete, isLoading }) => [
  {
    Header: "Subcategoría",
    accessor: "name",
    align: "left",
    Cell: SubcategoryNameCell,
  },
  {
    Header: "Categoría Padre",
    accessor: "categoryName",
    align: "center",
    Cell: ParentCategoryCell,
  },
  {
    Header: "Acciones",
    accessor: "actions",
    align: "center",
    Cell: (props) => (
      <SubcategoryActionsCell {...props} onDelete={handleDelete} isLoading={isLoading} />
    ),
  },
];
