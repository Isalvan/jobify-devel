import React from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';

function JobSidebar({ oferta }) {
    if (!oferta) return null;

    return (
        <aside>
            <div className="card-premium p-4 text-center">
                <div className="mb-3 mx-auto bg-light rounded-circle d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                    <img 
                        src={oferta.empresa?.logo ? api.getFileUrl(oferta.empresa.logo) : 'https://placehold.co/64x64'} 
                        alt="logo empresa" 
                        className="img-fluid rounded-circle"
                        style={{maxHeight: '100%', maxWidth: '100%'}} 
                    />
                </div>
                
                <div className="mb-3">
                    {oferta.empresa?.usuario_id ? (
                        <Link to={`/perfil/${oferta.empresa.usuario_id}`} className="text-decoration-none text-dark hover-primary">
                            <h3 className="h5 fw-bold mb-1">{oferta.empresa?.nombre}</h3>
                        </Link>
                    ) : (
                        <h3 className="h5 fw-bold mb-1">{oferta.empresa?.nombre}</h3>
                    )}
                    <div className="d-flex align-items-center justify-content-center gap-1 text-success small fw-medium">
                        <span className="material-symbols-outlined" style={{fontSize: '16px'}}>verified</span>
                        Empresa verificada
                    </div>
                </div>

                {oferta.empresa?.web && (
                    <a href={oferta.empresa.web} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm rounded-pill px-4 mb-3">
                        Visitar sitio web
                    </a>
                )}

                <hr className="my-3 text-muted opacity-25" />

                <Link to="/ofertas" className="d-flex align-items-center justify-content-center gap-2 text-decoration-none text-secondary hover-primary">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Ver más ofertas
                </Link>
            </div>
        </aside>
    );
}

export default JobSidebar;
