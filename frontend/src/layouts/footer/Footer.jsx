/**
 * Devuelve el componente Footer
 * 
 * @returns {JSX.Element}
 */
function Footer() {
  return <>
    <footer id="footer">
      <div className="container py-3 my-4">
        <ul className="nav justify-content-center border-bottom pb-3 mb-3">
          <li className="nav-item">
            <a href="#" className="nav-link px-3 text-muted">Inicio</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link px-3 text-muted">Acerca de Jobify</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link px-3 text-muted">Ofertas</a>
          </li>
        </ul>
        <p className="text-center text-body-secondary">&copy; 2025 Company, Inc</p>
      </div>
    </footer>
  </>
};

export default Footer;