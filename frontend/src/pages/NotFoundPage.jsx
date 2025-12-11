import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light text-center p-4">
            <span className="material-symbols-outlined text-primary mb-3" style={{ fontSize: '5rem', opacity: 0.5 }}>
                explore_off
            </span>
            <h1 className="display-1 fw-bold text-gradient mb-0">404</h1>
            <h2 className="h4 text-dark mb-3">Página no encontrada</h2>
            <p className="text-muted mb-4" style={{ maxWidth: '400px' }}>
                Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
            <Link to="/" className="btn-premium px-4 py-2">
                Volver al Inicio
            </Link>
        </div>
    );
}

export default NotFoundPage;
