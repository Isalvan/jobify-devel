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
        // Load featured companies
        companyService.getFeaturedCompanies()
            .then(response => {
                setEmpresasDestacadas(response.data);
                setLoadingDestacadas(false);
            })
            .catch(error => {
                console.error("Error cargando empresas destacadas:", error);
                setLoadingDestacadas(false);
            });

        // Load top rated jobs
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

    // Placeholder data removed


    // const ofertasMejorValoradas = [
    //     {
    //         puesto: "Puesto Placeholder 1",
    //         empresa: "Empresa Placeholder 1",
    //         valoracion: "4.8",
    //         descripcion: "Descripción breve de la oferta. Aquí irá el resumen del puesto.",
    //         ubicacion: "Ciudad, País"
    //     },
    //     {
    //         puesto: "Puesto Placeholder 2",
    //         empresa: "Empresa Placeholder 2",
    //         valoracion: "4.7",
    //         descripcion: "Descripción breve de la oferta. Aquí irá el resumen del puesto.",
    //         ubicacion: "Ciudad, País"
    //     },
    //     {
    //         puesto: "Puesto Placeholder 3",
    //         empresa: "Empresa Placeholder 3",
    //         valoracion: "4.6",
    //         descripcion: "Descripción breve de la oferta. Aquí irá el resumen del puesto.",
    //         ubicacion: "Ciudad, País"
    //     }
    // ];


    return (
        <div className="d-flex flex-column">

            {/* Buscador */}
            <section className="py-5">
                <div className="container text-center">
                    <h1 className="display-3 fw-bold mb-3">Encuentra el trabajo de tus sueños</h1>
                    <p className="lead mb-4">Conectamos talento con oportunidades. Empieza tu búsqueda ahora.</p>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const q = e.target.elements.search.value;
                        const loc = e.target.elements.location.value;
                        const params = new URLSearchParams();
                        if (q) params.append('search', q);
                        if (loc) params.append('ubicacion', loc);
                        navigate(`/ofertas?${params.toString()}`);
                    }} className="d-flex flex-wrap justify-content-center gap-2 mx-auto p-3 bg-light rounded shadow-sm" style={{ maxWidth: "800px" }}>

                        {/* Input 1 */}
                        <div className="position-relative flex-grow-1 mb-2 mb-md-0">
                            <div className="position-absolute top-0 bottom-0 start-0 d-flex align-items-center ps-2">
                                <span className="material-symbols-outlined text-secondary">work</span>
                            </div>
                            <input
                                type="text"
                                name="search"
                                className="form-control ps-5"
                                placeholder="Puesto, palabra clave o empresa"
                            />
                        </div>

                        {/* Input 2 */}
                        <div className="position-relative flex-grow-1 mb-2 mb-md-0">
                            <div className="position-absolute top-0 bottom-0 start-0 d-flex align-items-center ps-2">
                                <span className="material-symbols-outlined text-secondary">location_on</span>
                            </div>
                            <input
                                type="text"
                                name="location"
                                className="form-control ps-5"
                                placeholder="Ubicación"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary flex-shrink-0">
                            Buscar
                        </button>
                    </form>
                </div>
            </section>

            {/* Empresas Destacadas */}
            <section className="py-5 bg-light">
                <div className="container text-center">
                    <h2 className="display-5 fw-bold mb-4">Empresas Destacadas</h2>

                    {loadingDestacadas ? (
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {empresasDestacadas.length > 0 ? empresasDestacadas.map((company) => (
                                <div key={company.id} className="col-6 col-md-4 col-lg-2">
                                    <Link to={`/perfil/${company.usuario_id}`} className="text-decoration-none">
                                        <button className="btn btn-light w-100 d-flex flex-column align-items-center p-3 rounded shadow-sm hover-shadow h-100">
                                            <div className="bg-white p-2 rounded mb-2 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                                                <img
                                                    alt={`${company.usuario?.nombre} Logo`}
                                                    className="img-fluid"
                                                    src={company.usuario?.foto_perfil || "https://placehold.co/170x170"}
                                                    style={{ maxHeight: '100%', maxWidth: '100%' }}
                                                />
                                            </div>
                                            <h3 className="h6 mb-1 text-truncate w-100">{company.usuario?.nombre || 'Empresa'}</h3>
                                            <p className="small text-muted mb-0">{company.sector || 'Sector tech'}</p>
                                        </button>
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
                    <h2 className="display-6 fw-bold text-center mb-4">Ofertas mejor valoradas</h2>

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
                                    <div className="border rounded p-3 h-100 d-flex flex-column justify-content-between shadow-sm">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <h3 className="h6 fw-bold mb-0">
                                                    <Link to={`/ofertas/${oferta.id}`} className="text-decoration-none text-dark">
                                                        {oferta.titulo}
                                                    </Link>
                                                </h3>
                                                <small className="text-muted">
                                                    {oferta.empresa?.usuario?.nombre || oferta.empresa?.nombre || 'Empresa'}
                                                </small>
                                            </div>
                                            <span className="badge bg-warning text-dark d-flex align-items-center">
                                                <span className="material-symbols-outlined me-1" style={{ fontSize: "18px" }}>star</span>
                                                {oferta.valoraciones_avg ? parseFloat(oferta.valoraciones_avg).toFixed(1) : 'N/A'}
                                            </span>
                                        </div>
                                        <p className="small text-muted flex-grow-1 text-truncate" style={{ maxHeight: '3em' }}>
                                            {oferta.descripcion}
                                        </p>
                                        <div className="d-flex align-items-center small text-muted">
                                            <span className="material-symbols-outlined me-1">location_on</span>
                                            <span>{oferta.ubicacion}</span>
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
