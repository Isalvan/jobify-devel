import { useContext } from 'react';
import { AppContext } from '../contexts/AppProvider';
import CompanyJobsTable from '../components/admin/CompanyJobsTable';

function MisOfertasPage() {
    const { user } = useContext(AppContext);

    // Get company ID from user object (depends on how it's structured)
    const empresaId = user?.empresa?.id || user?.empleado?.empresa_id;

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold text-dark mb-1">Mis Ofertas</h2>
                    <p className="text-muted mb-0">Gestiona las vacantes publicadas por tu empresa.</p>
                </div>
                <div className="d-flex gap-2">
                    <a href="/crear-oferta" className="btn btn-premium px-4 py-2">
                        <span className="material-symbols-outlined me-2">add_circle</span>
                        Nueva Oferta
                    </a>
                </div>
            </div>

            <CompanyJobsTable empresaId={empresaId} />
        </div>
    );
}

export default MisOfertasPage;
