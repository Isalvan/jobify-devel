import React from 'react';
import { Link } from 'react-router-dom';

function JobSidebar({ oferta }) {
    if (!oferta) return null;

    return (
        <aside className="detalles-sidebar">
            <div className="empresa-card">
                <div className="logo-info">
                    <img src={oferta.empresa?.logo || 'https://placehold.co/64x64'} alt="logo empresa" />
                    <div>
                        {oferta.empresa?.usuario_id ? (
                            <Link to={`/perfil/${oferta.empresa.usuario_id}`} className="text-decoration-none text-dark">
                                <h3>{oferta.empresa?.nombre}</h3>
                            </Link>
                        ) : (
                            <h3>{oferta.empresa?.nombre}</h3>
                        )}
                        <p className="text-muted small">Empresa verificada</p>
                    </div>
                </div>
                {oferta.empresa?.web && (
                    <a href={oferta.empresa.web} target="_blank" rel="noopener noreferrer" className="web">Visitar web</a>
                )}
            </div>

            <div className="mt-3">
                <Link to="/ofertas" className="btn btn-outline-secondary w-100">
                    ← Ver más ofertas
                </Link>
            </div>
        </aside>
    );
}

export default JobSidebar;
