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
            <div className="bloque tarjeta descripcion">
                <h2>Descripción del puesto</h2>
                <p style={{ whiteSpace: 'pre-line' }}>{oferta.descripcion}</p>
            </div>

            <div className="bloque tarjeta datos-extra">
                {datosExtra.map((d, i) => (
                    <div key={i} className="detalle-row">
                        <span className="detalle-label">{d.label}</span>
                        <span className="detalle-value">{d.value}</span>
                    </div>
                ))}
            </div>
        </>
    );
}

export default JobDetails;
