import { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppProvider';
import { Navigate } from 'react-router-dom';
import AdminUsersTable from '../components/admin/AdminUsersTable';
import AdminJobsTable from '../components/admin/AdminJobsTable';
import AdminApplicationsTable from '../components/admin/AdminApplicationsTable';

function AdminDashboardPage() {
    const { user } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('users');

    if (!user || user.rol !== 'ADMIN') {
        return <Navigate to="/" />;
    }

    return (
        <div className="container py-5">
            <div className="mb-4">
                <h1 className="h3 fw-bold text-gradient mb-2">Panel de Administración</h1>
                <p className="text-muted">Gestiona usuarios, ofertas y aplicaciones de la plataforma</p>
            </div>

            <div className="card-premium p-4">
                <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                        <button 
                            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                            onClick={() => setActiveTab('users')}
                        >
                            <span className="material-symbols-outlined me-2" style={{fontSize: '18px', verticalAlign: 'text-bottom'}}>group</span>
                            Usuarios
                        </button>
                    </li>
                    <li className="nav-item">
                        <button 
                            className={`nav-link ${activeTab === 'jobs' ? 'active' : ''}`}
                            onClick={() => setActiveTab('jobs')}
                        >
                            <span className="material-symbols-outlined me-2" style={{fontSize: '18px', verticalAlign: 'text-bottom'}}>work</span>
                            Ofertas
                        </button>
                    </li>
                    <li className="nav-item">
                        <button 
                            className={`nav-link ${activeTab === 'applications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('applications')}
                        >
                            <span className="material-symbols-outlined me-2" style={{fontSize: '18px', verticalAlign: 'text-bottom'}}>description</span>
                            Aplicaciones
                        </button>
                    </li>
                </ul>

                {activeTab === 'users' && <AdminUsersTable />}
                {activeTab === 'jobs' && <AdminJobsTable />}
                {activeTab === 'applications' && <AdminApplicationsTable />}
            </div>
        </div>
    );
}

export default AdminDashboardPage;
