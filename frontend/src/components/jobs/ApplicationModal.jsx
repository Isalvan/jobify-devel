import React from 'react';

function ApplicationModal({
    show,
    onClose,
    oferta,
    user,
    onConfirm,
    applyFeedback,
    applying,
    useProfileCv,
    setUseProfileCv,
    setApplicationCvFile,
    mensaje,
    setMensaje
}) {
    if (!show || !oferta) return null;

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
                    <div className="modal-header bg-light border-bottom-0 py-4 px-5">
                        <div>
                            <h5 className="modal-title fw-bold text-gradient fs-4">Aplicar a esta oferta</h5>
                            <p className="text-muted small mb-0">{oferta.titulo}</p>
                        </div>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-5">
                        {applyFeedback && (
                            <div className={`alert alert-${applyFeedback.type} d-flex align-items-center gap-2`} role="alert">
                                {applyFeedback.type === 'success' && <span className="material-symbols-outlined">check_circle</span>}
                                {applyFeedback.type === 'warning' && <span className="material-symbols-outlined">warning</span>}
                                {applyFeedback.type === 'danger' && <span className="material-symbols-outlined">error</span>}
                                {applyFeedback.message}
                            </div>
                        )}

                        {!applyFeedback?.type?.includes('success') && (
                            <>
                                <div className="mb-4">
                                    <label className="form-label fw-bold mb-3 d-flex align-items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">description</span>
                                        Curriculum Vitae
                                    </label>

                                    <div className="d-flex flex-column gap-3">
                                        <label className={`card p-3 cursor-pointer transition-all border ${useProfileCv ? 'border-primary bg-primary-subtle' : 'border-light-subtle hover-border-primary'}`} 
                                               style={{cursor: 'pointer'}}
                                               onClick={() => user?.candidato?.url_cv && setUseProfileCv(true)}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="cvOption"
                                                        checked={useProfileCv}
                                                        onChange={() => {}}
                                                        disabled={!user?.candidato?.url_cv}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="fw-medium">Usar mi CV del perfil</div>
                                                    {user?.candidato?.url_cv ? (
                                                        <span className="text-success small d-flex align-items-center gap-1">
                                                            <span className="material-symbols-outlined" style={{fontSize: '14px'}}>check_circle</span> Disponible
                                                        </span>
                                                    ) : (
                                                        <span className="text-danger small d-flex align-items-center gap-1">
                                                            <span className="material-symbols-outlined" style={{fontSize: '14px'}}>cancel</span> No disponible
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </label>

                                        <label className={`card p-3 cursor-pointer transition-all border ${!useProfileCv ? 'border-primary bg-primary-subtle' : 'border-light-subtle hover-border-primary'}`}
                                               style={{cursor: 'pointer'}}
                                               onClick={() => setUseProfileCv(false)}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="cvOption"
                                                        checked={!useProfileCv}
                                                        onChange={() => {}}
                                                    />
                                                </div>
                                                <div className="w-100">
                                                    <div className="fw-medium mb-1">Subir un CV diferente</div>
                                                    {!useProfileCv && (
                                                        <input
                                                            type="file"
                                                            className="form-control form-control-sm mt-2"
                                                            accept=".pdf"
                                                            onClick={(e) => e.stopPropagation()}
                                                            onChange={(e) => setApplicationCvFile(e.target.files[0])}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="mensaje" className="form-label fw-bold d-flex align-items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">mail</span>
                                        Mensaje para la empresa <span className="text-muted fw-normal small">(opcional)</span>
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="mensaje"
                                        rows="3"
                                        placeholder="Cuéntales por qué eres el candidato ideal..."
                                        value={mensaje}
                                        onChange={(e) => setMensaje(e.target.value)}
                                        style={{resize: 'none'}}
                                    ></textarea>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="modal-footer border-top-0 px-5 pb-4">
                        <button type="button" className="btn btn-link text-decoration-none text-muted" onClick={onClose}>Cancelar</button>
                        {!applyFeedback?.type?.includes('success') && (
                            <button
                                type="button"
                                className="btn-premium px-4"
                                onClick={onConfirm}
                                disabled={applying}
                            >
                                {applying ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Enviando...
                                    </>
                                ) : 'Confirmar Aplicación'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApplicationModal;
