import { useState, useEffect } from 'react';
import { jobService } from '../../services/jobService';
import { Link } from 'react-router-dom';
import CommonPagination from './CommonPagination';

function AdminJobsTable() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [error, setError] = useState(null);

    // Search & Pagination state
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Reset to first page
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        loadJobs();
    }, [debouncedSearch, page]);

    const loadJobs = async () => {
        try {
            setLoading(true);
            const response = await jobService.getJobs({
                search: debouncedSearch,
                page: page,
                per_page: 15
            });

            if (response.meta) {
                setJobs(response.data || []);
                setPagination(response.meta);
            } else {
                setJobs(response.data || response || []);
                setPagination(null);
            }
        } catch (err) {
            console.error(err);
            setError('Error al cargar ofertas');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar esta oferta?')) return;

        try {
            await jobService.deleteJob(id);
            loadJobs();
        } catch (err) {
            console.error(err);
            alert('Error al eliminar oferta');
        }
    };

    return (
        <div>
            {/* Search Bar */}
            <div className="mb-4">
                <div className="input-group-premium p-1 pe-3">
                    <span className="material-symbols-outlined ms-3 text-muted">search</span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por título u empresa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="btn btn-link text-muted p-0" onClick={() => setSearchTerm('')}>
                            <span className="material-symbols-outlined fs-5">close</span>
                        </button>
                    )}
                </div>
            </div>

            {loading && !jobs.length ? (
                <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : error ? (
                <div className="alert alert-danger border-0 shadow-sm rounded-4">{error}</div>
            ) : (
                <>
                    <div className="table-responsive card-premium border-0 shadow-sm rounded-4 overflow-hidden">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr className="text-muted small text-uppercase">
                                    <th className="ps-4 py-3">ID</th>
                                    <th>Título</th>
                                    <th>Empresa</th>
                                    <th>Ubicación</th>
                                    <th>Estado</th>
                                    <th className="text-end pe-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.length > 0 ? (
                                    jobs.map(job => (
                                        <tr key={job.id}>
                                            <td className="ps-4 fw-bold text-muted">#{job.id}</td>
                                            <td>
                                                <Link to={`/ofertas/${job.id}`} className="text-decoration-none fw-bold text-primary">
                                                    {job.titulo}
                                                </Link>
                                            </td>
                                            <td>
                                                <div className="fw-medium text-dark">{job.empresa?.usuario?.nombre || job.empresa?.nombre || 'N/A'}</div>
                                            </td>
                                            <td className="text-muted">{job.ubicacion}</td>
                                            <td>
                                                <span className={`badge px-3 py-2 rounded-pill ${job.estado === 'publicado' ? 'bg-success-subtle text-success border border-success-subtle' :
                                                    job.estado === 'cerrado' ? 'bg-danger-subtle text-danger border border-danger-subtle' :
                                                        'bg-secondary-subtle text-secondary border border-secondary-subtle'
                                                    }`}>
                                                    {job.estado}
                                                </span>
                                            </td>
                                            <td className="pe-4 text-end">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <Link
                                                        to={`/ofertas/${job.id}`}
                                                        className="btn btn-sm btn-light border-0 text-primary"
                                                        title="Ver detalles"
                                                    >
                                                        <span className="material-symbols-outlined fs-5">visibility</span>
                                                    </Link>
                                                    <Link
                                                        to={`/ofertas/${job.id}/editar`}
                                                        className="btn btn-sm btn-light border-0"
                                                        title="Editar"
                                                    >
                                                        <span className="material-symbols-outlined fs-5">edit</span>
                                                    </Link>
                                                    <button
                                                        className="btn btn-sm btn-light text-danger border-0"
                                                        onClick={() => handleDelete(job.id)}
                                                        title="Eliminar"
                                                    >
                                                        <span className="material-symbols-outlined fs-5">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">No se encontraron ofertas.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <CommonPagination
                        pagination={pagination}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </>
            )}
        </div>
    );
}

export default AdminJobsTable;
