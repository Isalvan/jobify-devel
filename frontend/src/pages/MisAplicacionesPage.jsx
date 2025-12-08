import { useState, useEffect } from 'react';
import { applicationService } from '../services/applicationService';
import { Link } from 'react-router-dom';
import './css/MisAplicacionesPage.css';

function MisAplicacionesPage() {
    const [aplicaciones, setAplicaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        applicationService.getMyApplications()
            .then(data => {
                // data might be wrapped in { data: ... }
                setAplicaciones(data.data || data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Error al cargar tus aplicaciones.");
                setLoading(false);
            });
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDIENTE': return <span className="badge bg-warning text-dark">Pendiente</span>;
            case 'VISTO': return <span className="badge bg-info text-dark">Visto</span>;
            case 'EN_PROCESO': return <span className="badge bg-primary">En Proceso</span>;
            case 'FINALISTA': return <span className="badge bg-success">Finalista</span>;
            case 'RECHAZADO': return <span className="badge bg-danger">Rechazado</span>;
            default: return <span className="badge bg-secondary">{status}</span>;
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );

    return (
        <div className="container py-5" style={{ maxWidth: '900px' }}>
            <h1 className="h3 fw-bold mb-4">Mis Candidaturas</h1>

            {error ? (
                <div className="alert alert-danger">{error}</div>
            ) : aplicaciones.length > 0 ? (
                <div className="list-group shadow-sm">
                    {aplicaciones.map(app => {
                        const oferta = app.trabajo;
                        const empresa = oferta?.empresa;
                        const empresaUsuario = empresa?.usuario;

                        return (
                            <Link
                                key={app.id}
                                to={`/ofertas/${oferta?.id}`}
                                className="list-group-item list-group-item-action p-4 d-flex align-items-center gap-3 border-start-0 border-end-0"
                            >
                                <img
                                    src={empresaUsuario?.foto_perfil || 'https://placehold.co/60x60'}
                                    alt="Logo"
                                    className="rounded border bg-white p-1"
                                    width="60" height="60"
                                    style={{ objectFit: 'contain' }}
                                />

                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <h5 className="mb-0 fw-bold text-dark">{oferta?.titulo || 'Oferta no disponible'}</h5>
                                        {getStatusBadge(app.estado)}
                                    </div>
                                    <p className="mb-1 text-secondary">
                                        {empresa?.nombre || 'Empresa Confidencial'} <span className="mx-1">·</span> {oferta?.ubicacion}
                                    </p>
                                    <small className="text-muted">
                                        Aplicado el {new Date(app.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </small>
                                </div>

                                <span className="material-symbols-outlined text-muted">chevron_right</span>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-5 bg-light rounded border border-dashed">
                    <span className="material-symbols-outlined fs-1 text-muted mb-3">folder_off</span>
                    <h3 className="h5 text-muted">No has aplicado a ninguna oferta todavía.</h3>
                    <div className="mt-3">
                        <Link to="/ofertas" className="btn btn-primary">Buscar ofertas</Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MisAplicacionesPage;
