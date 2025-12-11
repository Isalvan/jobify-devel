
import React from 'react';
import { api } from '../../utils/api';
import { Link } from 'react-router-dom';

function ApplicationDetailModal({ application, onClose }) {
    if (!application) return null;

    const candidatoNombre = application.candidato?.usuario?.nombre || 'Desconocido';
    const candidatoEmail = application.candidato?.usuario?.email || 'N/A';
    const candidatoId = application.candidato?.usuario?.id;
    const trabajoTitulo = application.trabajo?.titulo || 'Desconocido';
    const trabajoId = application.trabajo?.id;
    const empresaNombre = application.trabajo?.empresa?.nombre || 'N/A';
    
    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Detalles de la Aplicación</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row g-4">
                            <div className="col-md-6">
                                <h6 className="fw-bold text-primary mb-3">Información del Candidato</h6>
                                <p className="mb-1"><strong>Nombre:</strong> {candidatoNombre}</p>
                                <p className="mb-1"><strong>Email:</strong> {candidatoEmail}</p>
                                {candidatoId && (
                                    <Link to={`/perfil/${candidatoId}`} className="btn btn-sm btn-outline-primary mt-2">
                                        Ver Perfil Completo
                                    </Link>
                                )}
                            </div>
                            <div className="col-md-6">
                                <h6 className="fw-bold text-primary mb-3">Información de la Oferta</h6>
                                <p className="mb-1"><strong>Título:</strong> {trabajoTitulo}</p>
                                <p className="mb-1"><strong>Empresa:</strong> {empresaNombre}</p>
                                <p className="mb-1"><strong>Estado:</strong> <span className="badge bg-secondary">{application.estado}</span></p>
                                {trabajoId && (
                                    <Link to={`/ofertas/${trabajoId}`} className="btn btn-sm btn-outline-primary mt-2">
                                        Ver Oferta
                                    </Link>
                                )}
                            </div>
                            
                            <div className="col-12">
                                <hr />
                                <h6 className="fw-bold text-primary mb-3">Mensaje / Carta de Presentación</h6>
                                <div className="p-3 bg-light rounded border">
                                    {application.mensaje ? (
                                        <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{application.mensaje}</p>
                                    ) : (
                                        <p className="text-muted mb-0 fst-italic">Sin mensaje.</p>
                                    )}
                                </div>
                            </div>

                            <div className="col-12">
                                <h6 className="fw-bold text-primary mb-3">Curriculum Vitae</h6>
                                {application.cv_url ? (
                                    <a 
                                        href={api.getFileUrl(application.cv_url)} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="btn btn-outline-dark d-inline-flex align-items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">description</span>
                                        Ver Documento CV
                                    </a>
                                ) : (
                                    <p className="text-muted fst-italic">No se ha adjuntado un CV específico (o usa el del perfil).</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApplicationDetailModal;
