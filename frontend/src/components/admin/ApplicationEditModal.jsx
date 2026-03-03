import { useState, useEffect } from 'react';
import { applicationService } from '../../services/applicationService';

function ApplicationEditModal({ show, onHide, application, onUpdate }) {
    const [estado, setEstado] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (application) {
            setEstado(application.estado);
        }
    }, [application]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await applicationService.updateApplication(application.id, { estado });
            onUpdate();
            onHide();
        } catch (err) {
            console.error(err);
            alert('Error al actualizar la aplicación');
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="modal-custom-overlay" onClick={onHide}>
            <div className="modal-custom-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content border-0 shadow-lg rounded-4 bg-white overflow-hidden">
                    <div className="modal-header border-0 pb-0 px-4 pt-4">
                        <h5 className="modal-title fw-bold">Editar Estado de Aplicación</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="mb-4">
                            <p className="text-muted small mb-1 text-uppercase fw-bold">Candidato</p>
                            <p className="fw-bold mb-3">{application?.candidato?.usuario?.nombre || 'N/A'}</p>
                            
                            <p className="text-muted small mb-1 text-uppercase fw-bold">Oferta</p>
                            <p className="fw-bold mb-0">{application?.trabajo?.titulo || 'N/A'}</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted">Estado Actual</label>
                                <select 
                                    className="form-select border-2 p-3 rounded-3" 
                                    value={estado} 
                                    onChange={(e) => setEstado(e.target.value)}
                                    required
                                >
                                    <option value="PENDIENTE">PENDIENTE</option>
                                    <option value="VISTO">VISTO</option>
                                    <option value="EN_PROCESO">EN_PROCESO</option>
                                    <option value="FINALISTA">FINALISTA</option>
                                    <option value="ACEPTADO">ACEPTADO</option>
                                    <option value="RECHAZADO">RECHAZADO</option>
                                </select>
                            </div>

                            <div className="d-grid gap-2 mt-4">
                                <button type="submit" className="btn btn-premium btn-lg rounded-3 py-3 shadow" disabled={loading}>
                                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                                <button type="button" className="btn btn-light rounded-3 py-2" onClick={onHide}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                .modal-custom-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                }
                .modal-custom-card {
                    width: 95%;
                    max-width: 450px;
                    animation: modalSlideUp 0.3s ease-out;
                }
                @keyframes modalSlideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}} />
        </div>
    );
}

export default ApplicationEditModal;
