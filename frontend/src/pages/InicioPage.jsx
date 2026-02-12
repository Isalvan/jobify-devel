import './css/InicioPage.css';
import { useContext } from 'react';
import { AppContext } from '../contexts/AppProvider';
import AdminDashboardPage from './AdminDashboardPage';
import EmpresaDashboard from '../components/EmpresaDashboard';
import LandingView from '../components/LandingView';

function InicioPage() {
    const { user, loading } = useContext(AppContext);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    // Role Semaphore
    if (user?.rol === 'ADMIN') {
        return <AdminDashboardPage />;
    }

    if (user?.rol === 'EMPRESA' || user?.rol === 'EMPLEADO') {
        return <EmpresaDashboard />;
    }

    // Default view for CANDIDATO, INVITADO (user is null), or any other role
    return <LandingView user={user} />;
}

export default InicioPage;
