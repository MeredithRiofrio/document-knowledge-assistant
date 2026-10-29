/**
 * Paginación por defecto con MDPagination (con truncamiento)
 */
import PropTypes from "prop-types";
import MDBox from "shared/ui/MDBox";
import MDPagination from "shared/ui/MDPagination";
import Icon from "@mui/material/Icon";

export default function PaginationDefault({ page, setPage, totalPages }) {
  if (totalPages <= 1) return null;

  const createRange = () => {
    const current = page + 1; // 1-based
    const total = totalPages;

    // Si pocas páginas, mostrar todas
    if (total <= 7) return [...Array(total).keys()].map((i) => i + 1);

    const range = new Set([1, 2, total - 1, total]);

    // Ventana alrededor de la página actual
    for (let i = current - 1; i <= current + 1; i++) {
      if (i > 2 && i < total - 1) range.add(i);
    }

    return [...range].sort((a, b) => a - b);
  };

  const pages = createRange();

  return (
    <MDBox display="flex" justifyContent="center">
      <MDPagination variant="gradient" color="info">
        {/* Flecha izquierda */}
        {page > 0 && (
          <MDPagination item onClick={() => setPage(page - 1)}>
            <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
          </MDPagination>
        )}

        {/* Números + ellipsis */}
        {pages.map((p, i) => {
          const prev = pages[i - 1];
          const showEllipsis = prev && p - prev > 1;

          return (
            <MDBox key={p} display="flex" alignItems="center">
              {showEllipsis && (
                <MDPagination item disabled>
                  …
                </MDPagination>
              )}

              <MDPagination item active={p - 1 === page} onClick={() => setPage(p - 1)}>
                {p}
              </MDPagination>
            </MDBox>
          );
        })}

        {/* Flecha derecha */}
        {page < totalPages - 1 && (
          <MDPagination item onClick={() => setPage(page + 1)}>
            <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
          </MDPagination>
        )}
      </MDPagination>
    </MDBox>
  );
}

PaginationDefault.propTypes = {
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
};
