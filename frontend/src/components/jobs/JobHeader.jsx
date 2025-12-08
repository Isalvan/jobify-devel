import React from 'react';

function JobHeader({ oferta, onToggleFavorite, onApply }) {
    if (!oferta) return null;

    return (
        <div className="bloque tarjeta header">
            <div className="header-content">
                <div>
                    <h1>{oferta.titulo}</h1>
                    <p className="empresa">{oferta.empresa?.nombre || 'Empresa Confidencial'} · {oferta.ubicacion}</p>
                </div>
                <div className="d-flex align-items-center">
                    <button
                        className="btn btn-link p-0 me-3"
                        onClick={onToggleFavorite}
                        title={oferta.is_favorito ? "Quitar de favoritos" : "Guardar en favoritos"}
                        style={{ textDecoration: 'none' }}
                    >
                        <span
                            className={`material-symbols-outlined fs-2 ${oferta.is_favorito ? 'text-warning' : 'text-secondary'}`}
                            style={{ color: oferta.is_favorito ? '#ffc107' : '' }}
                        >
                            {oferta.is_favorito ? 'turned_in' : 'turned_in_not'}
                        </span>
                    </button>

                    {oferta.mi_aplicacion ? (
                        <button className="btn btn-success" disabled>
                            <span className="material-symbols-outlined align-middle me-1">check_circle</span>
                            Ya has aplicado
                        </button>
                    ) : (
                        <button className="btn aplicar" onClick={onApply}>Aplicar ahora</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default JobHeader;
