import { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppProvider';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import './css/DashboardEmpresaPage.css';

function DashboardEmpresaPage() {
    const { user, logout } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Mapping of paths to active menu items
    const isActive = (path) => location.pathname === path;

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="dashboard-sidebar bg-white border-end">
                <div className="p-4 border-bottom">
                    <h5 className="fw-bold text-primary m-0">Panel Empresa</h5>
                    <small className="text-muted">{user?.nombre}</small>
                </div>

                <nav className="nav flex-column p-3 gap-2">
                    <Link to="/empresa/dashboard" className={`nav-link rounded ${isActive('/empresa/dashboard') ? 'active bg-primary text-white' : 'text-dark'}`}>
                        <span className="material-symbols-outlined me-2 align-middle">dashboard</span>
                        Resumen
                    </Link>
                    <Link to="/empresa/ofertas" className={`nav-link rounded ${isActive('/empresa/ofertas') ? 'active bg-primary text-white' : 'text-dark'}`}>
                        <span className="material-symbols-outlined me-2 align-middle">work</span>
                        Mis Ofertas
                    </Link>
                    <Link to="/empresa/empleados" className={`nav-link rounded ${isActive('/empresa/empleados') ? 'active bg-primary text-white' : 'text-dark'}`}>
                        <span className="material-symbols-outlined me-2 align-middle">group</span>
                        Empleados
                    </Link>
                    <Link to={`/perfil/${user?.id}`} className={`nav-link rounded ${isActive(`/perfil/${user?.id}`) ? 'active bg-primary text-white' : 'text-dark'}`}>
                        <span className="material-symbols-outlined me-2 align-middle">person</span>
                        Mi Perfil
                    </Link>
                </nav>

                <div className="mt-auto p-3 border-top">
                    <button onClick={logout} className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2">
                        <span className="material-symbols-outlined">logout</span>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="dashboard-content bg-light p-4">
                <div className="container-fluid">
                    {/* Nested routes will render here */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default DashboardEmpresaPage;
