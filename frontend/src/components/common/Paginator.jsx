export default function Paginator({ currentPage, lastPage, onPageChange, className = "mt-4" }) {
    if (!lastPage || lastPage <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5; // Total max visible buttons (numbers)
        
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(lastPage, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Always show first page
        if (startPage > 1) {
            pages.push(
                <button key={1} className="btn btn-sm btn-outline-secondary" onClick={() => onPageChange(1)}>
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(<span key="start-ellipsis" className="mx-1">...</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    className={`btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => onPageChange(i)}
                >
                    {i}
                </button>
            );
        }

        // Always show last page
        if (endPage < lastPage) {
            if (endPage < lastPage - 1) {
                pages.push(<span key="end-ellipsis" className="mx-1">...</span>);
            }
            pages.push(
                <button key={lastPage} className="btn btn-sm btn-outline-secondary" onClick={() => onPageChange(lastPage)}>
                    {lastPage}
                </button>
            );
        }

        return pages;
    };

    return (
        <footer className={`pagination d-flex justify-content-center align-items-center gap-1 ${className}`}>
            <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                ‹ Anterior
            </button>

            {renderPageNumbers()}

            <button
                className="btn btn-sm btn-outline-secondary ms-2"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= lastPage}
            >
                Siguiente ›
            </button>

            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    const val = parseInt(e.target.elements.goto.value);
                    if (val >= 1 && val <= lastPage) {
                        onPageChange(val);
                        e.target.reset();
                    }
                }}
                className="d-flex align-items-center ms-3 gap-2"
            >
                <span className="text-muted small">Ir a:</span>
                <input 
                    type="number" 
                    name="goto" 
                    className="form-control form-control-sm" 
                    style={{ width: '60px' }} 
                    min="1" 
                    max={lastPage} 
                    placeholder="#"
                />
            </form>
        </footer>
    );
}
