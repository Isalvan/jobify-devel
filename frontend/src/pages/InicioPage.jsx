import './css/InicioPage.css';

function InicioPage() {
    const empresasDestacadas = [
        { name: "Empresa Placeholder 1", jobs: 12, logo: "https://placehold.co/170x170" },
        { name: "Empresa Placeholder 2", jobs: 8, logo: "https://placehold.co/170x170" },
        { name: "Empresa Placeholder 3", jobs: 15, logo: "https://placehold.co/170x170" },
        { name: "Empresa Placeholder 4", jobs: 5, logo: "https://placehold.co/170x170" },
        { name: "Empresa Placeholder 5", jobs: 21, logo: "https://placehold.co/170x170" },
        { name: "Empresa Placeholder 6", jobs: 9, logo: "https://placehold.co/170x170" },
    ]; // TODO: Cambiar datos de eempresas destacadas por datos reales

    const ofertasMejorValoradas = [
        {
            puesto: "Puesto Placeholder 1",
            empresa: "Empresa Placeholder 1",
            valoracion: "4.8",
            descripcion: "Descripción breve de la oferta. Aquí irá el resumen del puesto.",
            ubicacion: "Ciudad, País"
        },
        {
            puesto: "Puesto Placeholder 2",
            empresa: "Empresa Placeholder 2",
            valoracion: "4.7",
            descripcion: "Descripción breve de la oferta. Aquí irá el resumen del puesto.",
            ubicacion: "Ciudad, País"
        },
        {
            puesto: "Puesto Placeholder 3",
            empresa: "Empresa Placeholder 3",
            valoracion: "4.6",
            descripcion: "Descripción breve de la oferta. Aquí irá el resumen del puesto.",
            ubicacion: "Ciudad, País"
        }
    ];


    return (
        <div className="d-flex flex-column">

            {/* Buscador */}
            <section className="py-5">
                <div className="container text-center">
                    <h1 className="display-3 fw-bold mb-3">Encuentra el trabajo de tus sueños</h1>
                    <p className="lead mb-4">Conectamos talento con oportunidades. Empieza tu búsqueda ahora.</p>

                    <div className="d-flex flex-wrap justify-content-center gap-2 mx-auto p-3 bg-light rounded shadow-sm" style={{ maxWidth: "800px" }}>
                        {/* Input 1 */}
                        <div className="position-relative flex-grow-1 mb-2 mb-md-0">
                            <div className="position-absolute top-0 bottom-0 start-0 d-flex align-items-center ps-2">
                                <span className="material-symbols-outlined text-secondary">work</span>
                            </div>
                            <input
                                type="text"
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
                                className="form-control ps-5"
                                placeholder="Ubicación"
                            />
                        </div>

                        <button className="btn btn-primary flex-shrink-0">
                            Buscar
                        </button>
                    </div>
                </div>
            </section>

            {/* Empresas Destacadas */}
            <section className="py-5 bg-light">
                <div className="container text-center">
                    <h2 className="display-5 fw-bold mb-4">Empresas Destacadas</h2>

                    <div className="row g-4">
                        {empresasDestacadas.map((company, i) => (
                            <div key={i} className="col-6 col-md-4 col-lg-2">
                                <button className="btn btn-light w-100 d-flex flex-column align-items-center p-3 rounded shadow-sm hover-shadow">
                                    <div className="bg-white p-2 rounded mb-2">
                                        <img alt={`${company.name} Logo`} className="img-fluid" src={company.logo} />
                                    </div>
                                    <h3 className="h6 mb-1">{company.name}</h3>
                                    <p className="small text-muted mb-0">{company.jobs} empleos</p>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ofertas mejor valoradas */}
            <section className="py-5">
                <div className="container">
                    <h2 className="display-6 fw-bold text-center mb-4">Ofertas mejor valoradas</h2>

                    <div className="row g-4">
                        {ofertasMejorValoradas.map((oferta, i) => (
                            <div key={i} className="col-12 col-md-6 col-lg-4">
                                <div className="border rounded p-3 h-100 d-flex flex-column justify-content-between">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <h3 className="h6 fw-bold mb-0">{oferta.puesto}</h3>
                                            <small className="text-muted">{oferta.empresa}</small>
                                        </div>
                                        <span className="badge bg-warning text-dark d-flex align-items-center">
                                            <span className="material-symbols-outlined me-1" style={{ fontSize: "18px" }}>star</span>
                                            {oferta.valoracion}
                                        </span>
                                    </div>
                                    <p className="small text-muted flex-grow-1">{oferta.descripcion}</p>
                                    <div className="d-flex align-items-center small text-muted">
                                        <span className="material-symbols-outlined me-1">location_on</span>
                                        <span>{oferta.ubicacion}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default InicioPage;
