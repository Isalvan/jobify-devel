import './header.css';
import logo from '../../assets/jobify-azul.svg';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../contexts/AppProvider';
import { api } from '../../utils/api';

/**
 * Devuelve el componente Header
 * 
 * @returns {JSX.Element}
 */
function Header() {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const sesion = !!user;

  const handleLogout = async () => {
      await logout();
      navigate('/');
  };

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
            {/* Enlace Descubrir - Ahora como enlace de texto simple para diferenciar */}
            <Link to="/ofertas" className="text-decoration-none text-muted fw-bold me-4 hover-primary transition-colors">Descubrir</Link>
            
            {/* Cuenta */}
            {sesion ? (
              <div className="dropdown">
                <a
                  href="#"
                  className="d-flex align-items-center text-decoration-none dropdown-toggle-custom"
                  id="dropdownUser1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ color: 'inherit' }}
                >
                  <div className="d-flex align-items-center gap-2 p-1 pe-3 rounded-pill hover-bg-light transition-all">
                    {user.foto_perfil ? (
                        <img src={api.getFileUrl(user.foto_perfil)} alt="avatar" width="40" height="40" className="rounded-circle border border-2 border-white shadow-sm" />
                    ) : (
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm" style={{width: '40px', height: '40px'}}>
                            {user.nombre.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="d-none d-md-block text-start">
                        <p className="mb-0 fw-bold small text-dark lh-1">{user.nombre}</p>
                        <p className="mb-0 small text-muted lh-1" style={{fontSize: '0.75rem'}}>{user.rol}</p>
                    </div>
                    <span className="material-symbols-outlined text-muted fs-5">expand_more</span>
                  </div>
                </a>
                
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-premium" aria-labelledby="dropdownUser1">
                  <li>
                    <Link className="dropdown-item-premium" to="/perfil">
                        <span className="material-symbols-outlined fs-5">person</span>
                        Tu Perfil
                    </Link>
                  </li>
                  
                  {user.rol === 'CANDIDATO' && (
                    <li>
                        <Link className="dropdown-item-premium" to="/mis-aplicaciones">
                            <span className="material-symbols-outlined fs-5">folder_shared</span>
                            Mis Candidaturas
                        </Link>
                    </li>
                  )}
                  
                  {(user.rol === 'EMPRESA' || user.rol === 'EMPLEADO') && (
                    <>
                        <li>
                            <Link className="dropdown-item-premium" to="/crear-oferta">
                                <span className="material-symbols-outlined fs-5">add_circle</span>
                                Publicar oferta
                            </Link>
                        </li>
                        <li>
                            <Link className="dropdown-item-premium" to={`/ofertas?empresa_id=${user.empresa?.id || user.empleado?.empresa_id}`}>
                                <span className="material-symbols-outlined fs-5">list_alt</span>
                                Mis Ofertas
                            </Link>
                        </li>
                    </>
                  )}
                  
                  {user.rol === 'CANDIDATO' && (
                    <li>
                        <Link className="dropdown-item-premium" to="/favoritos">
                            <span className="material-symbols-outlined fs-5">favorite</span>
                            Favoritos
                        </Link>
                    </li>
                  )}
                  
                  {user.rol === 'ADMIN' && (
                    <li>
                        <Link className="dropdown-item-premium" to="/admin">
                            <span className="material-symbols-outlined fs-5">admin_panel_settings</span>
                            Panel Admin
                        </Link>
                    </li>
                  )}
                  
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item-premium text-danger w-100 text-start" onClick={handleLogout}>
                        <span className="material-symbols-outlined fs-5">logout</span>
                        Cerrar sesión
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-premium-outline me-2">Iniciar sesión</Link>
                <Link to="/register" className="btn-premium">Regístrate</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  </>;
};

export default Header;