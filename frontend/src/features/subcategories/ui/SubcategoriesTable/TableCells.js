// src/layouts/tagsLists/SubcategoryTable/components/TableCells/index.js
import React from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";

// MUI
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

// Componentes del sistema
import MDTypography from "shared/ui/MDTypography";

// Nombre de la subcategoría
export function SubcategoryNameCell({ value }) {
  return <MDTypography variant="button">{value}</MDTypography>;
}

SubcategoryNameCell.propTypes = {
  value: PropTypes.string.isRequired,
};

// Nombre de la categoría padre
export function ParentCategoryCell({ value }) {
  return <MDTypography variant="button">{value}</MDTypography>;
}

ParentCategoryCell.propTypes = {
  value: PropTypes.string.isRequired,
};

// Acciones de editar y eliminar
function SubcategoryActionsCell({ row, onDelete, isLoading }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const subcategory = row.original;
  const id = subcategory.id;

  const openEditModal = () => {
    const current = new URLSearchParams(searchParams);
    current.set("entity", "subcategory");
    current.set("id", String(id));
    current.set("mode", "edit");

    setSearchParams(current, { replace: true });
  };

  return (
    <>
      <Tooltip title="Editar subcategoría">
        <span>
          <IconButton disabled={isLoading} onClick={openEditModal} aria-label="editar subcategoría">
            <MDTypography>
              <Icon>edit</Icon>
            </MDTypography>
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Eliminar subcategoría">
        <span>
          <IconButton
            disabled={isLoading}
            onClick={() => onDelete(subcategory)}
            aria-label="eliminar subcategoría"
          >
            <MDTypography>
              <Icon>delete</Icon>
            </MDTypography>
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
}

SubcategoryActionsCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default SubcategoryActionsCell;
