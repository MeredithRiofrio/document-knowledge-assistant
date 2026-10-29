/**
 * SmartList.jsx
 * Wrapper headless para filtrar + paginar listas.
 * - No depende de RHF.
 * - Usa Toolbar y Pagination por defecto con componentes de Material Dashboard.
 * - API: items, selector, renderItem, initialPageSize, pageSizeOptions, debounce
 */
import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import MDBox from "shared/ui/MDBox";
import ToolbarDefault from "./components/ToolbarDefault";
import PaginationDefault from "./components/PaginationDefault";
import normalize from "./utils/normalize";

export default function SmartList({
  items,
  selector,
  renderItem, // (item, absoluteIndex) => ReactNode
  initialPageSize = 5,
  pageSizeOptions = [5, 10, 15, 20, 25],
  showToolbar = true,
  showPagination = true,
  Toolbar = ToolbarDefault,
  Pagination = PaginationDefault,
  debounce = 0, // ms; 0 = sin debounce
}) {
  // Estado UI
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [page, setPage] = useState(0); // 0-based

  // Debounce opcional del query
  const [qDebounced, setQDebounced] = useState(query);
  useEffect(() => {
    if (!debounce) return setQDebounced(query);
    const t = setTimeout(() => setQDebounced(query), debounce);
    return () => clearTimeout(t);
  }, [query, debounce]);

  // Filtrado
  const filtered = useMemo(() => {
    const q = normalize(qDebounced.trim());
    if (!q) return items;
    const terms = q.split(/\s+/).filter(Boolean);
    return items.filter((it) => {
      const text = normalize(selector?.(it) ?? "");
      return terms.every((term) => text.includes(term));
    });
  }, [items, qDebounced, selector]);

  // Paginación
  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));

  // Reset página cuando cambia filtro/tamaño
  useEffect(() => setPage(0), [qDebounced, pageSize]);

  // Clamp si se reduce total de páginas
  useEffect(() => {
    if (page > totalPages - 1) setPage(totalPages - 1);
  }, [page, totalPages]);

  const start = page * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  return (
    <>
      {showToolbar && (
        <MDBox mb={4}>
          <Toolbar
            query={query}
            setQuery={setQuery}
            pageSize={pageSize}
            setPageSize={setPageSize}
            pageSizeOptions={pageSizeOptions}
            totalFiltered={totalFiltered}
          />
        </MDBox>
      )}

      {/* Render de elementos visibles */}
      <MDBox component="ul" p={0} m={0} sx={{ listStyle: "none" }}>
        {pageItems.map((it, k) => (
          <li key={it.key ?? it.id}> {renderItem(it, start + k)} </li>
        ))}
      </MDBox>

      {showPagination && (
        <MDBox mt={2}>
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </MDBox>
      )}
    </>
  );
}

SmartList.propTypes = {
  items: PropTypes.array.isRequired,
  selector: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  initialPageSize: PropTypes.number,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  showToolbar: PropTypes.bool,
  showPagination: PropTypes.bool,
  Toolbar: PropTypes.elementType,
  Pagination: PropTypes.elementType,
  debounce: PropTypes.number,
};
