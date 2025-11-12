import './header.css';
import logo from '../../assets/jobify-azul.svg';

/**
 * Devuelve el componente Header
 * 
 * @returns {JSX.Element}
 */
function Header() {
  const sesion = false; // TODO: Cambiar por sesión real
  const imagenUsuario = true; // TODO: Cambiar por la imágen de usuario

  return <>
    <header id="header" className="p-3 mb-3">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">
          {/* Logo */}
          <a href="/" className="d-flex align-items-center text-dark text-decoration-none">
            <img src={logo} alt="Jobify Logo" width="50" height="40" />
          </a>

          {/* Buscador / Cuenta */}
          <div className="d-flex align-items-center">
            {/* Buscador */}
            <form className="buscador-header me-3 flex-grow-1">
              <input type="search" className="form-control" placeholder="Búsca empleo..." aria-label="Search" />
            </form>

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
                  <span className="d-none d-sm-inline">Usuario</span>
                  {imagenUsuario ? (<img src="https://placehold.co/32x32" alt="mdo" width="32" height="32" className="rounded-circle ms-2" />) : (<></>)}
                </a>
                <ul className="dropdown-menu dropdown-menu-end text-small" aria-labelledby="dropdownUser1">
                  <li><a className="dropdown-item" href="#">Perfil</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#">Cerrar sesión</a></li>
                </ul>
              </div>
            ) : (
              <>
                <a href="/login" className="btn btn-primary mx-1">Iniciar sesión</a>
                <a href="/register" className="btn btn-outline-primary me-2">Regístrate</a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  </>;
};

export default Header;