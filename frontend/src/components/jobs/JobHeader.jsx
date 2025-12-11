import { Link, useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';

function JobHeader({ oferta, user, onToggleFavorite, onApply, onStatusChange, onWithdraw }) {
    const navigate = useNavigate();
    if (!oferta) return null;

    const isCompany = user?.rol === 'EMPRESA' || user?.rol === 'empresa' || user?.rol === 'EMPLEADO' || user?.rol === 'empleado';
    const isOwner = isCompany && (
        (user?.empresa?.id && user.empresa.id == oferta.empresa_id) || 
        (user?.empleado?.empresa_id && user.empleado.empresa_id == oferta.empresa_id)
    );

    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta oferta? Esta acción no se puede deshacer.')) {
            try {
                await jobService.deleteJob(oferta.id);
                navigate('/ofertas');
            } catch (error) {
                console.error("Error deleting job", error);
                alert("Error al eliminar la oferta");
            }
        }
    };

    const handleToggleStatus = async () => {
        try {
            const newStatus = oferta.estado === 'publicado' ? 'cerrado' : 'publicado';
            await jobService.updateJob(oferta.id, { estado: newStatus });
            // Refresh parent or reload
            if (onStatusChange) onStatusChange(newStatus);
            else window.location.reload(); 
        } catch (error) {
            console.error("Error updating status", error);
            alert("Error al actualizar el estado");
        }
    };

    return (
        <div className="card-premium p-4 mb-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <h1 className="fw-bold mb-0 text-gradient">{oferta.titulo}</h1>
                        {oferta.estado === 'cerrado' && <span className="badge bg-danger">CERRADA</span>}
                        {oferta.estado === 'borrador' && <span className="badge bg-secondary">BORRADOR</span>}
                    </div>
                    <div className="d-flex flex-wrap align-items-center gap-2 text-muted">
                         <span className="material-symbols-outlined fs-5">business</span>
                         <span className="fw-medium">{oferta.empresa?.nombre || 'Empresa Confidencial'}</span>
                         <span className="mx-1">•</span>
                         <span className="material-symbols-outlined fs-5">location_on</span>
                         <span>{oferta.ubicacion}</span>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                    {!isCompany && (
                        <button
                            className="btn btn-link p-0 text-decoration-none"
                            onClick={onToggleFavorite}
                            title={oferta.is_favorito ? "Quitar de favoritos" : "Guardar en favoritos"}
                        >
                            <span
                                className={`material-symbols-outlined fs-2 ${oferta.is_favorito ? 'text-warning' : 'text-secondary opacity-50 hover-opacity-100'}`}
                                style={{ transition: 'all 0.2s' }}
                            >
                                {oferta.is_favorito ? 'turned_in' : 'turned_in_not'}
                            </span>
                        </button>
                    )}

                    {isCompany ? (
                        isOwner ? (
                            <div className="d-flex gap-2 flex-wrap justify-content-end">
                                <Link to={`/ofertas/${oferta.id}/aplicaciones`} className="btn btn-outline-primary px-3 py-2 rounded-pill fw-bold text-decoration-none">
                                    <span className="material-symbols-outlined me-1" style={{fontSize: '18px', verticalAlign: 'text-bottom'}}>group</span>
                                    Candidatos
                                </Link>
                                <Link to={`/ofertas/${oferta.id}/editar`} className="btn btn-outline-secondary px-3 py-2 rounded-pill fw-bold text-decoration-none">
                                    <span className="material-symbols-outlined me-1" style={{fontSize: '18px', verticalAlign: 'text-bottom'}}>edit</span>
                                    Editar
                                </Link>
                                <button className="btn btn-outline-warning px-3 py-2 rounded-pill fw-bold" onClick={handleToggleStatus}>
                                    <span className="material-symbols-outlined me-1" style={{fontSize: '18px', verticalAlign: 'text-bottom'}}>
                                        {oferta.estado === 'publicado' ? 'lock' : 'lock_open'}
                                    </span>
                                    {oferta.estado === 'publicado' ? 'Cerrar' : 'Abrir'}
                                </button>
                                <button className="btn btn-outline-danger px-3 py-2 rounded-pill fw-bold" onClick={handleDelete}>
                                    <span className="material-symbols-outlined me-1" style={{fontSize: '18px', verticalAlign: 'text-bottom'}}>delete</span>
                                </button>
                            </div>
                        ) : null
                    ) : (
                        oferta.mi_aplicacion ? (
                            <div className="d-flex gap-2">
                                <button className="btn btn-success d-flex align-items-center gap-2 px-4 py-2" disabled>
                                    <span className="material-symbols-outlined fs-5">check_circle</span>
                                    Aplicado
                                </button>
                                <button 
                                    className="btn btn-outline-danger d-flex align-items-center gap-2 px-3 py-2" 
                                    onClick={onWithdraw}
                                    title="Retirar candidatura"
                                >
                                    <span className="material-symbols-outlined fs-5">delete</span>
                                </button>
                            </div>
                        ) : (
                            oferta.estado !== 'cerrado' ? (
                                <button className="btn-premium px-4 py-2" onClick={onApply}>Aplicar ahora</button>
                            ) : (
                                <button className="btn btn-secondary px-4 py-2" disabled>Oferta cerrada</button>
                            )
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default JobHeader;
