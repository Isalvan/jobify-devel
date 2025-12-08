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
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Aplicar a {oferta.titulo}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {applyFeedback && (
                            <div className={`alert alert-${applyFeedback.type}`} role="alert">
                                {applyFeedback.message}
                            </div>
                        )}

                        {!applyFeedback?.type?.includes('success') && (
                            <>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Curriculum Vitae</label>

                                    <div className="form-check mb-2">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="cvOption"
                                            id="cvProfile"
                                            checked={useProfileCv}
                                            onChange={() => setUseProfileCv(true)}
                                            disabled={!user?.candidato?.url_cv}
                                        />
                                        <label className="form-check-label" htmlFor="cvProfile">
                                            Usar mi CV del perfil
                                            {user?.candidato?.url_cv ? (
                                                <span className="text-muted ms-2 small">(Disponible)</span>
                                            ) : (
                                                <span className="text-danger ms-2 small">(No tienes CV en tu perfil)</span>
                                            )}
                                        </label>
                                    </div>

                                    <div className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="cvOption"
                                            id="cvUpload"
                                            checked={!useProfileCv}
                                            onChange={() => setUseProfileCv(false)}
                                        />
                                        <label className="form-check-label" htmlFor="cvUpload">
                                            Subir un CV diferente ahora
                                        </label>
                                    </div>

                                    {!useProfileCv && (
                                        <div className="mb-3 ms-4">
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => setApplicationCvFile(e.target.files[0])}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="mensaje" className="form-label fw-bold">Mensaje para la empresa (opcional)</label>
                                    <textarea
                                        className="form-control"
                                        id="mensaje"
                                        rows="3"
                                        placeholder="Explica brevemente por qué eres el candidato ideal..."
                                        value={mensaje}
                                        onChange={(e) => setMensaje(e.target.value)}
                                    ></textarea>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                        {!applyFeedback?.type?.includes('success') && (
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={onConfirm}
                                disabled={applying}
                            >
                                {applying ? 'Enviando...' : 'Confirmar Aplicación'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApplicationModal;
