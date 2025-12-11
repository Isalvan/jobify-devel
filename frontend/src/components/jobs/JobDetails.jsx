import React from 'react';

function JobDetails({ oferta }) {
    if (!oferta) return null;

    const datosExtra = [
        { label: 'Modalidad', value: oferta.tipo_trabajo },
        { label: 'Ubicación', value: oferta.ubicacion },
        { label: 'Salario', value: oferta.salario ? `${parseFloat(oferta.salario).toLocaleString()}€` : 'No especificado' },
        { label: 'Publicado', value: new Date(oferta.created_at).toLocaleDateString() },
        { label: 'Jornada', value: 'Jornada completa' },
        { label: 'Contrato', value: 'Indefinido' },
    ];

    return (
        <>
            <div className="card-premium p-4 mb-4">
                <h3 className="h5 fw-bold mb-3 d-flex align-items-center gap-2">
                    <span className="material-symbols-outlined text-primary">description</span>
                    Descripción del puesto
                </h3>
                <div className="text-secondary" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                    {oferta.descripcion}
                </div>
            </div>

            <div className="card-premium p-4 mb-4">
                <h3 className="h5 fw-bold mb-3 d-flex align-items-center gap-2">
                    <span className="material-symbols-outlined text-primary">info</span>
                    Detalles adicionales
                </h3>
                <div className="row g-3">
                    {datosExtra.map((d, i) => (
                        <div key={i} className="col-12 col-md-6 col-lg-4">
                            <div className="p-3 rounded bg-light border h-100">
                                <small className="text-muted d-block mb-1 text-uppercase fw-bold" style={{fontSize: '0.75rem'}}>{d.label}</small>
                                <span className="fw-medium text-dark">{d.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default JobDetails;
