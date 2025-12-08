import './header.css';
import logo from '../../assets/jobify-azul.svg';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../contexts/AppProvider';

/**
 * Devuelve el componente Header
 * 
 * @returns {JSX.Element}
 */
function Header() {
  const { user, logout } = useContext(AppContext);
  const sesion = !!user; // Si hay usuario, hay sesión

  return <>
    <header id="header" className="p-3 mb-3">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">
          {/* Logo */}
          <Link to="/" className="d-flex align-items-center text-dark text-decoration-none">
            <img src={logo} alt="Jobify Logo" width="50" height="40" />
          </Link>

          {/* Buscador / Cuenta */}
          <div className="d-flex align-items-center">
            {/* Buscador */}
            {/* Enlace Descubrir */}
            <Link to="/ofertas" className="btn btn-outline-secondary me-3">Descubrir</Link>

            {/* Cuenta */}
            {sesion ? (
              <div className="dropdown">
                <a
                  href="#"
                  className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle"
                  id="dropdownUser1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="d-none d-sm-inline">{user.nombre || 'Usuario'}</span>
                  {user.foto_perfil ? (<img src={user.foto_perfil} alt="mdo" width="32" height="32" className="rounded-circle ms-2" />) : (<></>)}
                </a>
                <ul className="dropdown-menu dropdown-menu-end text-small" aria-labelledby="dropdownUser1">
                  <li><Link className="dropdown-item" to="/perfil">Perfil</Link></li>
                  {user.rol === 'CANDIDATO' && (
                    <li><Link className="dropdown-item" to="/mis-aplicaciones">Mis Candidaturas</Link></li>
                  )}
                  <li><Link className="dropdown-item" to="/favoritos">Mis Favoritos</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={logout}>Cerrar sesión</button></li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary mx-1">Iniciar sesión</Link>
                <Link to="/register" className="btn btn-outline-primary me-2">Regístrate</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  </>;
};

export default Header;