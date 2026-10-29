import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useSearchParams } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import MDTypography from "shared/ui/MDTypography";
import SmartMenu from "shared/ui/Items/SmartMenu";

export function DocumentNameCell({ value }) {
  return <MDTypography variant="button">{value}</MDTypography>;
}
DocumentNameCell.propTypes = {
  value: PropTypes.string.isRequired,
};

export function CategoryNameCell({ value }) {
  return <MDTypography variant="button">{value}</MDTypography>;
}
CategoryNameCell.propTypes = {
  value: PropTypes.string,
};

export function SubcategoryNameCell({ value }) {
  return <MDTypography variant="button">{value}</MDTypography>;
}
SubcategoryNameCell.propTypes = {
  value: PropTypes.string,
};

function DocumentsActionsCell({ row, onDelete }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const document = row.original;
  const id = document.id;

  const handleOpenMenu = (e) => setMenuAnchor(e.currentTarget);
  const handleCloseMenu = () => setMenuAnchor(null);

  const openPreviewModal = () => {
    const current = new URLSearchParams(searchParams);
    current.set("id", id);
    current.set("mode", "preview");
    setSearchParams(current, { replace: true });

    handleCloseMenu();
  };

  return (
    <>
      <Tooltip title="Acciones">
        <span>
          <IconButton onClick={handleOpenMenu}>
            <MDTypography>
              <Icon>more_vert</Icon>
            </MDTypography>
          </IconButton>
        </span>
      </Tooltip>

      <SmartMenu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        onClose={handleCloseMenu}
        options={[
          { icon: "preview", title: "Ver", action: openPreviewModal },
          {
            icon: "edit",
            title: "Editar",
            action: () => {
              handleCloseMenu();
              navigate(`/admin/documents/edit/${id}`);
            },
          },
          {
            icon: "delete",
            title: "Eliminar",
            action: () => {
              handleCloseMenu();
              onDelete(document);
            },
          },
          // {
          //   icon: "swap_horiz",
          //   title: "Reemplazar",
          //   action: () => {
          //     handleCloseMenu();
          //     navigate(`/admin/documents/replace/${id}`);
          //   },
          // },
        ]}
      />
    </>
  );
}

DocumentsActionsCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DocumentsActionsCell;
