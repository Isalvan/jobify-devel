import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import Paginator from '../components/common/Paginator';
import './css/MisAplicacionesPage.css'; // Reutilizamos estilos

function MisFavoritosPage() {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        setLoading(true);
        try {
            const response = await jobService.getFavorites();
            setFavoritos(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("No se pudieron cargar tus favoritos.");
            setLoading(false);
        }
    };

    const handleRemove = async (jobId) => {
        try {
            await jobService.toggleFavorite(jobId);
            setFavoritos(prev => prev.filter(job => job.id !== jobId));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-5 text-center">Cargando favoritos...</div>;
    if (error) return <div className="p-5 text-center text-danger">{error}</div>;

    return (
        <div className="mis-aplicaciones-page container py-5">
            <h1 className="mb-4 fw-bold">Mis Ofertas Guardadas</h1>

            {favoritos.length === 0 ? (
                <div className="text-center py-5 bg-light rounded shadow-sm">
                    <span className="material-symbols-outlined fs-1 text-muted mb-3">heart_broken</span>
                    <h3 className="h5 text-muted">No tienes ofertas guardadas.</h3>
                    <Link to="/ofertas" className="btn btn-primary mt-3">Explorar ofertas</Link>
                </div>
            ) : (
                <div className="list-group shadow-sm">
                    {favoritos.map(job => (
                        <div key={job.id} className="list-group-item p-4 d-flex flex-column flex-md-row gap-4 align-items-center align-items-md-start">
                            {/* Logo */}
                            <div className="flex-shrink-0">
                                <img
                                    src={job.empresa?.logo || 'https://placehold.co/64x64'}
                                    alt="logo"
                                    className="rounded border"
                                    style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-grow-1 w-100">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h5 className="mb-1 fw-bold">
                                            <Link to={`/ofertas/${job.id}`} className="text-decoration-none text-dark stretched-link-hack">
                                                {job.titulo}
                                            </Link>
                                        </h5>
                                        <p className="mb-1 text-muted">{job.empresa?.nombre}</p>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-outline-danger z-index-front"
                                        onClick={() => handleRemove(job.id)}
                                        title="Quitar de favoritos"
                                        style={{ zIndex: 2 }} // Ensure click doesn't trigger Link if overlaid
                                    >
                                        <span className="material-symbols-outlined align-middle fs-6">delete</span>
                                    </button>
                                </div>

                                <div className="d-flex gap-3 text-muted small mt-2">
                                    <span className="d-flex align-items-center gap-1">
                                        <span className="material-symbols-outlined fs-6">location_on</span>
                                        {job.ubicacion}
                                    </span>
                                    <span className="d-flex align-items-center gap-1">
                                        <span className="material-symbols-outlined fs-6">work</span>
                                        {job.tipo_trabajo}
                                    </span>
                                    <span className="d-flex align-items-center gap-1">
                                        <span className="material-symbols-outlined fs-6">payments</span>
                                        {job.salario ? `${parseFloat(job.salario).toLocaleString()}€` : 'S/N'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MisFavoritosPage;
