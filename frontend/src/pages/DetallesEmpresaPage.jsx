import { useParams, Link } from 'react-router-dom';
import './css/DetallesEmpresaPage.css';

function DetallesEmpresaPage() {
    const { id } = useParams();

    // TODO: Obtener datos de la empresa desde la API
    const empresa = {
        id,
        nombre: 'Empresa 1',
        descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        sector: 'Tecnología',
        tamaño_empresa: '100-500 empleados',
        ubicacion: 'Ciudad, País',
        web: 'https://empresa1.com',
        logo: 'https://placehold.co/100x100'
    };

    // TODO: Obtener ofertas de la empresa desde la API
    const ofertas = [
        {
            id: 1,
            titulo: 'Oferta 1',
            empresa: empresa.nombre,
            ubicacion: 'Ciudad, País',
            salario: 30,
            tipo: 'Remoto',
            categoria: 'Tecnología',
            descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            etiquetas: ['Tecnología'],
            imagen: empresa.logo,
            dias: 2
        },
        {
            id: 2,
            titulo: 'Oferta 2',
            empresa: empresa.nombre,
            ubicacion: 'Ciudad, País',
            salario: 40,
            tipo: 'Presencial',
            categoria: 'Marketing',
            descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            etiquetas: ['Marketing', 'Ventas'],
            imagen: empresa.logo,
            dias: 1
        },
        {
            id: 3,
            titulo: 'Oferta 3',
            empresa: empresa.nombre,
            ubicacion: 'Ciudad, País',
            salario: 35,
            tipo: 'Híbrido',
            categoria: 'Diseño',
            descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            etiquetas: ['Diseño'],
            imagen: empresa.logo,
            dias: 0
        }
    ];

    const datosEmpresa = [
        { label: 'Sector', value: empresa.sector },
        { label: 'Tamaño de empresa', value: empresa.tamaño_empresa },
        { label: 'Ubicación', value: empresa.ubicacion },
        { label: 'Sitio web', value: empresa.web }
    ];

    function formatearDias(dias) {
        if (dias === 0) return 'Publicado hoy';
        if (dias === 1) return 'Publicado ayer';
        return `Publicado hace ${dias} días`;
    }

    return (
        <div className="detalles-empresa-page">
            {/* Header - Ancho completo */}
            <div className="bloque tarjeta header-empresa">
                <div className="header-empresa-content">
                    <div className="logo-titulo">
                        <img src={empresa.logo} alt={`Logo de ${empresa.nombre}`} className="logo-empresa" />
                        <div>
                            <h1>{empresa.nombre}</h1>
                            <p className="subtitulo">{empresa.sector} · {empresa.ubicacion}</p>
                        </div>
                    </div>
                    <a href={empresa.web} target="_blank" rel="noopener noreferrer" className="btn visitar-web">
                        Visitar sitio web
                    </a>
                </div>
            </div>

            {/* Contenedor con main y sidebar */}
            <div className="detalles-empresa-container">
                <div className="detalles-empresa-main">
                    {/* Descripción */}
                    <div className="bloque tarjeta descripcion-empresa">
                        <h2>Sobre la empresa</h2>
                        <p className="descripcion-texto">{empresa.descripcion}</p>
                    </div>

                    {/* Ofertas de la empresa */}
                    <div className="bloque tarjeta ofertas-empresa">
                        <h2>Ofertas de empleo ({ofertas.length})</h2>
                        <div className="lista-ofertas">
                            {ofertas.map(oferta => (
                                <article className="oferta-card" key={oferta.id}>
                                    <div className="oferta-left">
                                        <img src={oferta.imagen} alt="logo" />
                                    </div>
                                    <div className="oferta-main">
                                        <div className="oferta-header">
                                            <div>
                                                <h4 className="oferta-titulo">
                                                    {/* TODO: Conectar con la ruta real de detalles de oferta */}
                                                    <Link to={`/oferta/${oferta.id}`}>{oferta.titulo}</Link>
                                                </h4>
                                                <div className="oferta-empresa-ubicacion">
                                                    {oferta.empresa} - <span className="location">{oferta.ubicacion}</span>
                                                </div>
                                            </div>

                                            <div className="oferta-meta">
                                                <div className="oferta-fecha">{formatearDias(oferta.dias)}</div>
                                                <button className="bookmark material-symbols-outlined">bookmark</button>
                                            </div>
                                        </div>

                                        <p className="oferta-descripcion">{oferta.descripcion}</p>

                                        <div className="oferta-tags">
                                            {oferta.etiquetas.map((t, i) => (
                                                <span className="tag" key={i}>{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* TODO: Implementar paginación cuando haya muchas ofertas */}
                        <footer className="paginacion">
                            <button className="btn btn-sm btn-outline-secondary">‹</button>
                            <button className="btn btn-sm btn-primary">1</button>
                            <button className="btn btn-sm btn-outline-secondary">2</button>
                            <button className="btn btn-sm btn-outline-secondary">3</button>
                            <span className="text-muted">…</span>
                            <button className="btn btn-sm btn-outline-secondary">10</button>
                            <button className="btn btn-sm btn-outline-secondary">›</button>
                        </footer>
                    </div>
                </div>

                {/* Sidebar - Información de la empresa */}
                <aside className="detalles-empresa-sidebar">
                    <div className="bloque tarjeta datos-empresa">
                        <h2>Información de la empresa</h2>
                        {datosEmpresa.map((d, i) => (
                            <div key={i} className="detalle-row">
                                <span className="detalle-label">{d.label}</span>
                                <span className="detalle-value">{d.value}</span>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default DetallesEmpresaPage;
