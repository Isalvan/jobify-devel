import { Link, useLocation } from 'react-router-dom';

const routeNameMap = {
    'ofertas': 'Ofertas',
    'perfil': 'Mi Perfil',
    'login': 'Iniciar Sesión',
    'register': 'Registro'
};

export default function Breadcrumbs() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

    if (pathnames.length === 0) return null;

    return (
        <div className="container mt-3">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/">Inicio</Link>
                    </li>
                    {pathnames.map((value, index) => {
                        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                        const isLast = index === pathnames.length - 1;

                        // Determinar nombre a mostrar
                        let displayName = routeNameMap[value] || value;

                        // Si es un ID numérico y el padre es 'ofertas'
                        if (!isNaN(value) && pathnames[index - 1] === 'ofertas') {
                            if (location.state?.oferta?.titulo) {
                                displayName = location.state.oferta.titulo;
                            } else {
                                displayName = `Oferta #${value}`; // Fallback visual
                            }
                        }

                        // Capitalizar si no está en mapa
                        if (!routeNameMap[value] && displayName === value) {
                            displayName = value.charAt(0).toUpperCase() + value.slice(1);
                        }

                        return isLast ? (
                            <li className="breadcrumb-item active" aria-current="page" key={to}>
                                {displayName}
                            </li>
                        ) : (
                            <li className="breadcrumb-item" key={to}>
                                <Link to={to}>{displayName}</Link>
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </div>
    );
}
