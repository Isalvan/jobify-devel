import { useState, useEffect } from 'react';
import { applicationService } from '../../services/applicationService';
import { Link } from 'react-router-dom';
import ApplicationDetailModal from './ApplicationDetailModal';
import ApplicationEditModal from './ApplicationEditModal';
import CommonPagination from './CommonPagination';

function AdminApplicationsTable() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [error, setError] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [editingApplication, setEditingApplication] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Search & Pagination state
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        loadApplications();
    }, [debouncedSearch, page]);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const response = await applicationService.getMyApplications({
                search: debouncedSearch,
                page: page,
                per_page: 20
            });

            if (response.meta) {
                setApplications(response.data || []);
                setPagination(response.meta);
            } else {
                setApplications(response.data || response || []);
                setPagination(null);
            }
        } catch (err) {
            console.error(err);
            setError('Error al cargar aplicaciones');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar esta aplicación?')) return;

        try {
            await applicationService.deleteApplication(id);
            loadApplications();
        } catch (err) {
            console.error(err);
            alert('Error al eliminar aplicación');
        }
    };

    const handleEdit = (app) => {
        setEditingApplication(app);
        setShowEditModal(true);
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
                        placeholder="Buscar por candidato u oferta..."
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

            {loading && !applications.length ? (
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
                                    <th>Candidato</th>
                                    <th>Oferta</th>
                                    <th>Estado</th>
                                    <th>Fecha</th>
                                    <th className="text-end pe-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.length > 0 ? (
                                    applications.map(app => (
                                        <tr key={app.id}>
                                            <td className="ps-4 fw-bold text-muted">#{app.id}</td>
                                            <td>
                                                <div className="fw-bold text-dark">{app.candidato?.usuario?.nombre || 'N/A'}</div>
                                            </td>
                                            <td>
                                                <Link to={`/ofertas/${app.trabajo?.id}`} className="text-decoration-none text-primary fw-medium">
                                                    {app.trabajo?.titulo || 'N/A'}
                                                </Link>
                                            </td>
                                            <td>
                                                <span className={`badge px-3 py-2 rounded-pill ${app.estado === 'ACEPTADO' ? 'bg-success-subtle text-success border border-success-subtle' :
                                                    app.estado === 'RECHAZADO' ? 'bg-danger-subtle text-danger border border-danger-subtle' :
                                                        app.estado === 'EN_PROCESO' ? 'bg-primary-subtle text-primary border border-primary-subtle' :
                                                            'bg-warning-subtle text-warning border border-warning-subtle'
                                                    }`}>
                                                    {app.estado}
                                                </span>
                                            </td>
                                            <td className="text-muted small">{new Date(app.created_at).toLocaleDateString()}</td>
                                            <td className="pe-4 text-end">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <button
                                                        className="btn btn-sm btn-light border-0 text-primary"
                                                        onClick={() => setSelectedApplication(app)}
                                                        title="Ver detalles"
                                                    >
                                                        <span className="material-symbols-outlined fs-5">visibility</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-light border-0"
                                                        onClick={() => handleEdit(app)}
                                                        title="Editar"
                                                    >
                                                        <span className="material-symbols-outlined fs-5">edit</span>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-light text-danger border-0"
                                                        onClick={() => handleDelete(app.id)}
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
                                        <td colSpan="6" className="text-center py-5 text-muted">No se encontraron aplicaciones.</td>
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

            {selectedApplication && (
                <ApplicationDetailModal
                    application={selectedApplication}
                    onClose={() => setSelectedApplication(null)}
                />
            )}

            <ApplicationEditModal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                application={editingApplication}
                onUpdate={loadApplications}
            />
        </div>
    );
}

export default AdminApplicationsTable;
