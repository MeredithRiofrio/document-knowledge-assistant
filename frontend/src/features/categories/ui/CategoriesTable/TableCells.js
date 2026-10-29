// src/layouts/tagsLists/CategoryTable/TableCells/index.js
import React from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";

// MUI
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

// Componentes del sistema
import MDTypography from "shared/ui/MDTypography";

// Nombre de la categoría con estilo
export function CategoryNameCell({ value }) {
  return <MDTypography variant="button">{value}</MDTypography>;
}

CategoryNameCell.propTypes = {
  value: PropTypes.string.isRequired,
};

export function SubcategoryCountCell({ value }) {
  return <MDTypography variant="button">{value}</MDTypography>;
}

SubcategoryCountCell.propTypes = {
  value: PropTypes.number.isRequired,
};

// Acciones de editar y eliminar
function CategoryActionsCell({ row, onDelete, isLoading }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = row.original;
  const id = category.id;

  const openEditModal = () => {
    const current = new URLSearchParams(searchParams);
    current.set("entity", "category");
    current.set("id", String(id));
    current.set("mode", "edit");

    setSearchParams(current, { replace: true });
  };

  return (
    <>
      <Tooltip title="Editar categoría">
        <span>
          <IconButton disabled={isLoading} onClick={openEditModal} aria-label="editar categoría">
            <MDTypography>
              <Icon>edit</Icon>
            </MDTypography>
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Eliminar categoría">
        <span>
          <IconButton
            disabled={isLoading}
            onClick={() => onDelete(category)}
            aria-label="eliminar categoría"
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

CategoryActionsCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

CategoryActionsCell.defaultProps = {
  isLoading: false,
};

export default CategoryActionsCell;
