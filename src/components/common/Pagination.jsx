export default function Pagination({ page, pageSize, total, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <nav className="pagination" aria-label="Paginación">
      <button type="button" className="secondary" onClick={() => onChange(page - 1)} disabled={page <= 1}>
        Anterior
      </button>
      <span>Página {page} de {totalPages} · {total} tickets</span>
      <button type="button" className="secondary" onClick={() => onChange(page + 1)} disabled={page >= totalPages}>
        Siguiente
      </button>
    </nav>
  );
}
