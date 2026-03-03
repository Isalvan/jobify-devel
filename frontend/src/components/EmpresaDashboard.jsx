import { Link } from 'react-router-dom';

function EmpresaDashboard() {
    return (
        <div className="container py-5">
            <div className="mb-4">
                <h1 className="h3 fw-bold text-gradient mb-2">Panel de Empresa</h1>
                <p className="text-muted">Gestiona tus ofertas y candidatos desde aquí.</p>
            </div>

            <div className="card-premium p-5 text-center">
                <div className="mb-4">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '64px' }}>business_center</span>
                </div>
                <h2 className="h4 fw-bold mb-3">Bienvenido a tu Espacio de Empresa</h2>
                <p className="text-muted mb-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    Desde aquí podrás publicar nuevas ofertas de trabajo, gestionar las existentes y revisar las candidaturas recibidas.
                </p>
                <div className="d-flex justify-content-center gap-3">
                    <Link to="/crear-oferta" className="btn btn-premium px-4 py-2">
                        <span className="material-symbols-outlined me-2 text-white">add_circle</span>
                        Crear Nueva Oferta
                    </Link>
                    <Link to="/mis-ofertas" className="btn btn-premium-outline px-4 py-2">
                        <span className="material-symbols-outlined me-2">list</span>
                        Ver mis ofertas
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default EmpresaDashboard;
