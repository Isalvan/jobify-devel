export default function Paginator({ currentPage, lastPage, onPageChange }) {
    if (!lastPage || lastPage <= 1) return null;

    return (
        <footer className="pagination mt-4 d-flex justify-content-center align-items-center gap-2">
            <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                ‹ Anterior
            </button>

            <span className="mx-2 text-muted">
                Página {currentPage} de {lastPage}
            </span>

            <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= lastPage}
            >
                Siguiente ›
            </button>
        </footer>
    );
}
