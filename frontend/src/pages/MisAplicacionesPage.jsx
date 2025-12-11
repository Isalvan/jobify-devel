
import { useState, useEffect } from 'react';
import { applicationService } from '../services/applicationService';
import { Link } from 'react-router-dom';

function MisAplicacionesPage() {
    const [aplicaciones, setAplicaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        applicationService.getMyApplications()
            .then(data => {
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
            case 'PENDIENTE': return <span className="badge bg-warning text-dark bg-opacity-75">Pendiente</span>;
            case 'VISTO': return <span className="badge bg-info text-dark bg-opacity-75">Visto</span>;
            case 'EN_PROCESO': return <span className="badge bg-primary">En Proceso</span>;
            case 'FINALISTA': return <span className="badge bg-success">Finalista</span>;
            case 'RECHAZADO': return <span className="badge bg-danger">Rechazado</span>;
            default: return <span className="badge bg-secondary">{status}</span>;
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres retirar esta candidatura? Esta acción no se puede deshacer.')) {
            try {
                await applicationService.deleteApplication(id);
                setAplicaciones(aplicaciones.filter(app => app.id !== id));
            } catch (err) {
                console.error(err);
                alert('Hubo un error al retirar la candidatura.');
            }
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );

    return (
        <div className="container py-5" style={{ maxWidth: '900px' }}>
            <h1 className="h3 fw-bold mb-4 text-gradient">Mis Candidaturas</h1>

            {error ? (
                <div className="alert alert-danger shadow-sm border-0">{error}</div>
            ) : aplicaciones.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                    {aplicaciones.map(app => {
                        const oferta = app.trabajo;
                        const empresa = oferta?.empresa;
                        const empresaUsuario = empresa?.usuario;

                        return (
                            <div
                                key={app.id}
                                className="card-premium p-4 d-flex align-items-center gap-3 transition-transform hover-translate-y position-relative"
                            >
                                <div className="bg-light rounded p-2 d-flex align-items-center justify-content-center" style={{width: '64px', height: '64px'}}>
                                    <img
                                        src={empresaUsuario?.foto_perfil || 'https://placehold.co/60x60'}
                                        alt="Logo"
                                        className="img-fluid"
                                        style={{ maxHeight: '100%', maxWidth: '100%' }}
                                    />
                                </div>

                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <h5 className="mb-0 fw-bold text-primary">
                                            <Link to={`/ofertas/${oferta?.id}`} className="text-decoration-none text-primary stretched-link">
                                                {oferta?.titulo || 'Oferta no disponible'}
                                            </Link>
                                        </h5>
                                        {getStatusBadge(app.estado)}
                                    </div>
                                    <p className="mb-1 text-secondary fw-medium">
                                        {empresa?.nombre || 'Empresa Confidencial'} <span className="mx-1 text-muted">•</span> <span className="text-muted">{oferta?.ubicacion}</span>
                                    </p>
                                    <small className="text-muted d-flex align-items-center gap-1">
                                        <span className="material-symbols-outlined fs-6">calendar_today</span>
                                        Aplicado el {new Date(app.created_at).toLocaleDateString()}
                                    </small>
                                </div>

                                <div className="z-2 position-relative d-flex align-items-center gap-2">
                                     <button 
                                        onClick={() => handleDelete(app.id)}
                                        className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 bg-white"
                                        title="Retirar candidatura"
                                    >
                                        <span className="material-symbols-outlined fs-6">delete</span>
                                        <span className="d-none d-md-inline">Retirar</span>
                                    </button>
                                     <span className="material-symbols-outlined text-muted opacity-50">chevron_right</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="card-premium p-5 text-center">
                    <span className="material-symbols-outlined fs-1 text-muted mb-3 opacity-50">folder_off</span>
                    <h3 className="h5 text-muted fw-normal">No has aplicado a ninguna oferta todavía.</h3>
                    <div className="mt-4">
                        <Link to="/ofertas" className="btn-premium px-4">Explorar ofertas</Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MisAplicacionesPage;
