import './css/InicioPage.css';

import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { companyService } from '../services/companyService';
import { jobService } from '../services/jobService';

function InicioPage() {
    const navigate = useNavigate();
    const [empresasDestacadas, setEmpresasDestacadas] = useState([]);
    const [loadingDestacadas, setLoadingDestacadas] = useState(true);
    const [ofertasMejorValoradas, setOfertasMejorValoradas] = useState([]);
    const [loadingValoradas, setLoadingValoradas] = useState(true);

    useEffect(() => {
        companyService.getFeaturedCompanies()
            .then(response => {
                setEmpresasDestacadas(response.data);
                setLoadingDestacadas(false);
            })
            .catch(error => {
                console.error("Error cargando empresas destacadas:", error);
                setLoadingDestacadas(false);
            });

        jobService.getTopRated()
            .then(response => {
                setOfertasMejorValoradas(response.data);
                setLoadingValoradas(false);
            })
            .catch(error => {
                console.error("Error cargando ofertas destacadas:", error);
                setLoadingValoradas(false);
            });
    }, []);

    return (
        <div className="d-flex flex-column bg-white">

            {/* Buscador / Hero */}
            <section className="py-5 bg-hero">
                <div className="container text-center py-5">
                    <h1 className="display-3 fw-bold mb-3 text-gradient">Encuentra el trabajo de tus sueños</h1>
                    <p className="lead mb-5 text-muted">Conectamos talento con oportunidades. Empieza tu búsqueda ahora.</p>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const q = e.target.elements.search.value;
                        const loc = e.target.elements.location.value;
                        const params = new URLSearchParams();
                        if (q) params.append('search', q);
                        if (loc) params.append('location', loc);
                        navigate(`/ofertas?${params.toString()}`);
                    }} className="d-flex flex-wrap justify-content-center gap-3 mx-auto" style={{ maxWidth: "800px" }}>

                        {/* Input 1 */}
                        <div className="input-group-premium flex-grow-1">
                            <span className="material-symbols-outlined text-primary ms-2">work</span>
                            <input
                                type="text"
                                name="search"
                                placeholder="Puesto, palabra clave o empresa"
                            />
                        </div>

                        {/* Input 2 */}
                        <div className="input-group-premium flex-grow-1">
                            <span className="material-symbols-outlined text-primary ms-2">location_on</span>
                            <input
                                type="text"
                                name="location"
                                placeholder="Ubicación"
                            />
                        </div>

                        <button type="submit" className="btn-premium flex-shrink-0 px-4">
                            Buscar
                        </button>
                    </form>
                </div>
            </section>

            {/* Empresas Destacadas */}
            <section className="py-5 bg-light">
                <div className="container text-center">
                    <h2 className="display-5 fw-bold mb-5">Empresas <span className="text-gradient">Destacadas</span></h2>

                    {loadingDestacadas ? (
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {empresasDestacadas.length > 0 ? empresasDestacadas.map((company) => (
                                <div key={company.id} className="col-6 col-md-4 col-lg-2">
                                    <Link to={`/perfil/${company.usuario_id}`} className="text-decoration-none">
                                        <div className="card-premium h-100 p-4 d-flex flex-column align-items-center justify-content-center">
                                            <div className="bg-white p-2 rounded mb-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                                                <img
                                                    alt={`${company.usuario?.nombre} Logo`}
                                                    className="img-fluid"
                                                    src={company.usuario?.foto_perfil || "https://placehold.co/170x170"}
                                                    style={{ maxHeight: '100%', maxWidth: '100%' }}
                                                />
                                            </div>
                                            <h3 className="h6 mb-1 text-truncate w-100 fw-bold">{company.usuario?.nombre || 'Empresa'}</h3>
                                            <p className="small text-muted mb-0">{company.sector || 'Sector tech'}</p>
                                        </div>
                                    </Link>
                                </div>
                            )) : (
                                <p className="text-muted">No hay empresas destacadas en este momento.</p>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Ofertas mejor valoradas */}
            <section className="py-5">
                <div className="container">
                    <h2 className="display-6 fw-bold text-center mb-5">Ofertas <span className="text-gradient">mejor valoradas</span></h2>

                    {loadingValoradas ? (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {ofertasMejorValoradas.length > 0 ? ofertasMejorValoradas.map((oferta) => (
                                <div key={oferta.id} className="col-12 col-md-6 col-lg-4">
                                    <div className="card-premium h-100 p-4 d-flex flex-column justify-content-between">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h3 className="h5 fw-bold mb-1">
                                                    <Link to={`/ofertas/${oferta.id}`} className="text-decoration-none text-dark">
                                                        {oferta.titulo}
                                                    </Link>
                                                </h3>
                                                <small className="text-primary fw-medium">
                                                    {oferta.empresa?.usuario?.nombre || oferta.empresa?.nombre || 'Empresa'}
                                                </small>
                                            </div>
                                            <span className="badge bg-warning text-dark d-flex align-items-center px-2 py-1 rounded-pill">
                                                <span className="material-symbols-outlined me-1" style={{ fontSize: "16px" }}>star</span>
                                                {oferta.valoraciones_avg ? parseFloat(oferta.valoraciones_avg).toFixed(1) : 'N/A'}
                                            </span>
                                        </div>
                                        <p className="small text-muted flex-grow-1 text-truncate mb-3" style={{ maxHeight: '3em', whiteSpace: 'normal', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                            {oferta.descripcion}
                                        </p>
                                        <div className="d-flex align-items-center small text-muted border-top pt-3 mt-auto justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <span className="material-symbols-outlined me-1 text-secondary" style={{fontSize: '18px'}}>location_on</span>
                                                <span>{oferta.ubicacion}</span>
                                            </div>
                                            <Link to={`/ofertas/${oferta.id}`} className="btn btn-sm btn-premium rounded-pill px-3 stretched-link">
                                                Ver oferta
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-muted">No hay ofertas valoradas todavía.</p>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default InicioPage;
