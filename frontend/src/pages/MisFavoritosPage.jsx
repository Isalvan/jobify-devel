
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';

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

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );
    if (error) return <div className="p-5 text-center text-danger">{error}</div>;

    return (
        <div className="container py-5">
            <h1 className="mb-4 fw-bold text-gradient">Mis Ofertas Guardadas</h1>

            {favoritos.length === 0 ? (
                <div className="card-premium p-5 text-center">
                    <span className="material-symbols-outlined fs-1 text-muted mb-3 opacity-50">favorite</span>
                    <h3 className="h5 text-muted fw-normal">No tienes ofertas guardadas.</h3>
                    <Link to="/ofertas" className="btn-premium px-4 mt-4">Explorar ofertas</Link>
                </div>
            ) : (
                <div className="row g-4">
                    {favoritos.map(job => (
                        <div key={job.id} className="col-12 col-lg-6">
                            <div className="card-premium p-4 h-100 d-flex flex-column">
                                <div className="d-flex gap-3 mb-3">
                                    <div className="bg-light rounded p-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{width: '64px', height: '64px'}}>
                                        <img
                                            src={job.empresa?.logo || 'https://placehold.co/64x64'}
                                            alt="logo"
                                            className="img-fluid"
                                            style={{ maxHeight: '100%', maxWidth: '100%' }}
                                        />
                                    </div>
                                    <div className="flex-grow-1">
                                         <Link to={`/ofertas/${job.id}`} className="text-decoration-none text-dark hover-primary">
                                            <h5 className="mb-1 fw-bold">{job.titulo}</h5>
                                        </Link>
                                        <p className="mb-0 text-secondary small fw-medium">{job.empresa?.nombre}</p>
                                    </div>
                                    <button
                                        className="btn btn-link p-0 text-danger opacity-75 hover-opacity-100 align-self-start"
                                        onClick={() => handleRemove(job.id)}
                                        title="Quitar de favoritos"
                                    >
                                        <span className="material-symbols-outlined fs-5">delete</span>
                                    </button>
                                </div>

                                <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center text-muted small">
                                    <span className="d-flex align-items-center gap-1">
                                        <span className="material-symbols-outlined fs-6">location_on</span>
                                        {job.ubicacion}
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
