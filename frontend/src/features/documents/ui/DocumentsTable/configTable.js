// src/layouts/docsTable/utils/configTable.js
import DocumentsActionsCell, {
  DocumentNameCell,
  CategoryNameCell,
  SubcategoryNameCell,
} from "./TableCells";

export const getColumns = ({ handleDelete }) => [
  {
    Header: "Nombre del Documento",
    accessor: "name",
    align: "left",
    Cell: DocumentNameCell,
  },
  {
    Header: "Categoría",
    accessor: "categoryName",
    align: "left",
    Cell: CategoryNameCell,
  },
  {
    Header: "Subcategoría",
    accessor: "subcategoryName",
    align: "left",
    Cell: SubcategoryNameCell,
  },
  {
    Header: "Acciones",
    accessor: "actions",
    align: "center",
    Cell: (props) => <DocumentsActionsCell {...props} onDelete={handleDelete} />,
  },
];
