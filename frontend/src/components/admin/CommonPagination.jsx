import React from 'react';

/**
 * CommonPagination - A reusable pagination component for Laravel-style paginated responses.
 * 
 * @param {Object} pagination - The pagination data object from Laravel (meta/links or raw response)
 * @param {Function} onPageChange - Callback function when a page is clicked
 */
function CommonPagination({ pagination, onPageChange }) {
    if (!pagination || pagination.last_page <= 1) return null;

    const { current_page, last_page, links } = pagination;

    // Filter links to show a reasonable range or just standard Bootstrap style
    // Laravel's default pagination links usually include 'Previous', numbers, and 'Next'

    return (
        <nav aria-label="Page navigation" className="mt-4">
            <ul className="pagination justify-content-center">
                {/* First Page Button */}
                <li className={`page-item ${current_page === 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link shadow-sm border-0 rounded-start-3"
                        onClick={() => onPageChange(1)}
                        disabled={current_page === 1}
                        title="Primera página"
                    >
                        <span className="material-symbols-outlined fs-5 align-middle">first_page</span>
                    </button>
                </li>

                {/* Previous Button */}
                <li className={`page-item ${current_page === 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link shadow-sm border-0"
                        onClick={() => onPageChange(current_page - 1)}
                        disabled={current_page === 1}
                        title="Anterior"
                    >
                        <span className="material-symbols-outlined fs-5 align-middle">chevron_left</span>
                    </button>
                </li>

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, last_page) }, (_, i) => {
                    let pageNum;
                    if (last_page <= 5) {
                        pageNum = i + 1;
                    } else if (current_page <= 3) {
                        pageNum = i + 1;
                    } else if (current_page >= last_page - 2) {
                        pageNum = last_page - 4 + i;
                    } else {
                        pageNum = current_page - 2 + i;
                    }

                    return (
                        <li key={pageNum} className={`page-item ${current_page === pageNum ? 'active' : ''}`}>
                            <button
                                className={`page-link border-0 shadow-sm mx-1 rounded-3 ${current_page === pageNum ? 'bg-primary fw-bold' : ''}`}
                                onClick={() => onPageChange(pageNum)}
                            >
                                {pageNum}
                            </button>
                        </li>
                    );
                })}

                {/* Next Button */}
                <li className={`page-item ${current_page === last_page ? 'disabled' : ''}`}>
                    <button
                        className="page-link shadow-sm border-0"
                        onClick={() => onPageChange(current_page + 1)}
                        disabled={current_page === last_page}
                        title="Siguiente"
                    >
                        <span className="material-symbols-outlined fs-5 align-middle">chevron_right</span>
                    </button>
                </li>

                {/* Last Page Button */}
                <li className={`page-item ${current_page === last_page ? 'disabled' : ''}`}>
                    <button
                        className="page-link shadow-sm border-0 rounded-end-3"
                        onClick={() => onPageChange(last_page)}
                        disabled={current_page === last_page}
                        title="Última página"
                    >
                        <span className="material-symbols-outlined fs-5 align-middle">last_page</span>
                    </button>
                </li>
            </ul>
            <div className="text-center text-muted extra-small mt-2">
                Página {current_page} de {last_page} (Total: {pagination.total} registros)
            </div>
        </nav>
    );
}

export default CommonPagination;
