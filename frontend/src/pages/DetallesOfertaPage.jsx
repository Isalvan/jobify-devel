import { useParams, Link } from 'react-router-dom';
import './css/DetallesOfertaPage.css';

function DetallesOfertaPage() {
    const { id } = useParams();

    const oferta = {
        id,
        puesto: 'Puesto 1',
        empresa: {
            nombre: 'Empresa 1',
            descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            sector: 'Sector 1',
            size: '100-500 empleados',
            ubicacion: 'Ciudad, País',
            web: 'https://empresa1.com',
            img: 'https://placehold.co/64x64'
        },
        ubicacion: 'Ciudad, País',
        tipoJornada: 'Jornada completa',
        tipoTrabajo: 'Presencial',
        tipoContrato: 'Indefinido',
        expMin: 2,
        estudios: 'Grado universitario',
        salarioMin: 35000,
        salarioMax: 50000,
        publicado: 3,
        descripcion: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
        ultimas: [
            { puesto: 'Puesto 2', tipoJornada: 'completa', ubicacion: 'Ciudad, País' },
            { puesto: 'Puesto 3', tipoJornada: 'parcial', ubicacion: 'Ciudad, País' },
            { puesto: 'Puesto 4', tipoJornada: 'completa', ubicacion: 'Ciudad, País' }
        ],
        numValoraciones: 124,
        valoracion: 4.5,
        valoraciones: [
            { usuario: 'Usuario1', comentario: 'Comentario del Usuario 1.', valoracion: 5 },
            { usuario: 'Usuario2', comentario: 'Comentario del Usuario 2.', valoracion: 4 },
            { usuario: 'Usuario3', comentario: 'Comentario del Usuario 3.', valoracion: 3 }
        ]
    };

    function Star({ id, fill = 0, size = 18 }) {
        const pct = Math.max(0, Math.min(1, fill)) * 100;
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <clipPath id={id}>
                        <rect x="0" y="0" width={`${pct}%`} height="24" />
                    </clipPath>
                </defs>
                <path d="M12 .587l3.668 7.431L24 9.748l-6 5.847L19.335 24 12 19.897 4.665 24 6 15.595 0 9.748l8.332-1.73L12 .587z" fill="#e4e5e9" />
                <path d="M12 .587l3.668 7.431L24 9.748l-6 5.847L19.335 24 12 19.897 4.665 24 6 15.595 0 9.748l8.332-1.73L12 .587z" fill="#ffc107" clipPath={`url(#${id})`} />
            </svg>
        );
    }

    function renderEstrellas(valor, prefix) {
        const clamped = Math.max(0, Math.min(5, Number(valor) || 0));
        return (
            <div className="d-flex gap-1" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => {
                    const fill = Math.max(0, Math.min(1, clamped - i));
                    const id = `${prefix}-star-${i}`;
                    return <Star key={i} id={id} fill={fill} size={18} />;
                })}
            </div>
        );
    }

    const datosExtra = [
        { label: 'Jornada', value: oferta.tipoJornada },
        { label: 'Tipo de trabajo', value: oferta.tipoTrabajo },
        { label: 'Contrato', value: oferta.tipoContrato },
        { label: 'Experiencia mínima', value: `${oferta.expMin} años` },
        { label: 'Estudios', value: oferta.estudios },
        { label: 'Salario', value: `${oferta.salarioMin.toLocaleString()}€ - ${oferta.salarioMax.toLocaleString()}€` },
    ];

    return (
        <div className="detalles-container">
            <div className="detalles-main">
                {/* Header */}
                <div className="bloque tarjeta header">
                    <div className="header-content">
                        <div>
                            <h1>{oferta.puesto}</h1>
                            <p className="empresa">{oferta.empresa.nombre} · {oferta.ubicacion}</p>
                        </div>
                        <button className="btn aplicar">Aplicar ahora</button>
                    </div>
                </div>

                {/* Descripción */}
                <div className="bloque tarjeta descripcion">
                    <h2>Descripción del puesto</h2>
                    <p>{oferta.descripcion}</p>
                </div>

                {/* Datos extra */}
                <div className="bloque tarjeta datos-extra">
                    {datosExtra.map((d, i) => (
                        <div key={i} className="detalle-row">
                            <span className="detalle-label">{d.label}</span>
                            <span className="detalle-value">{d.value}</span>
                        </div>
                    ))}
                </div>

                {/* Valoraciones */}
                <div className="bloque tarjeta valoraciones">
                    <h2>Valoraciones</h2>
                    <div className="resumen">
                        <div className="nota">
                            <span className="puntaje fw-bold">{oferta.valoracion.toFixed(1)}</span>
                            <span className="total">/5</span>
                            {renderEstrellas(oferta.valoracion, 'main')}
                        </div>
                        <span className="cantidad">{oferta.numValoraciones} valoraciones</span>
                    </div>
                    <div className="lista-valoraciones">
                        {oferta.valoraciones.map((v, i) => (
                            <div key={i} className="valoracion">
                                <div className="usuario">
                                    <strong>{v.usuario}</strong>
                                    {renderEstrellas(v.valoracion, `val-${i}`)}
                                </div>
                                <p>{v.comentario}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <aside className="detalles-sidebar">
                {/* Empresa */}
                <div className="empresa-card">
                    <div className="logo-info">
                        <img src={oferta.empresa.img} alt="logo empresa" />
                        <div>
                            <h3>{oferta.empresa.nombre}</h3>
                            <p>{oferta.empresa.sector} · {oferta.empresa.size}</p>
                        </div>
                    </div>
                    <p>{oferta.empresa.descripcion}</p>
                    <a href={oferta.empresa.web} target="_blank" rel="noopener noreferrer" className="web">Visitar web</a>
                </div>

                {/* Últimas ofertas */}
                <div className="ultimas-ofertas">
                    <h3>Ofertas recientes</h3>
                    <ul>
                        {oferta.ultimas.map((o, i) => (
                            <li key={i}>
                                <Link to="#">
                                    <strong>{o.puesto}</strong>
                                    <span>Jornada {o.tipoJornada} · {o.ubicacion}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </div>
    );
}

export default DetallesOfertaPage;
