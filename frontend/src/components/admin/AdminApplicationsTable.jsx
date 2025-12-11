import { useState, useEffect } from 'react';
import { applicationService } from '../../services/applicationService';
import { Link } from 'react-router-dom';
import ApplicationDetailModal from './ApplicationDetailModal';

function AdminApplicationsTable() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const response = await applicationService.getMyApplications();
            setApplications(response.data || []);
        } catch (err) {
            console.error(err);
            setError('Error al cargar aplicaciones');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar esta aplicación?')) return;
        
        try {
            await applicationService.deleteApplication(id);
            setApplications(applications.filter(a => a.id !== id));
        } catch (err) {
            console.error(err);
            alert('Error al eliminar aplicación');
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border"></div></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Candidato</th>
                            <th>Oferta</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map(app => (
                            <tr key={app.id}>
                                <td>{app.id}</td>
                                <td>{app.candidato?.usuario?.nombre || 'N/A'}</td>
                                <td>
                                    <Link to={`/ofertas/${app.trabajo?.id}`} className="text-decoration-none">
                                        {app.trabajo?.titulo || 'N/A'}
                                    </Link>
                                </td>
                                <td>
                                    <span className={`badge ${
                                        app.estado === 'ACEPTADO' ? 'bg-success' :
                                        app.estado === 'RECHAZADO' ? 'bg-danger' :
                                        app.estado === 'EN_PROCESO' ? 'bg-primary' :
                                        'bg-warning text-dark'
                                    }`}>
                                        {app.estado}
                                    </span>
                                </td>
                                <td>{new Date(app.created_at).toLocaleDateString()}</td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => setSelectedApplication(app)}
                                        >
                                            <span className="material-symbols-outlined" style={{fontSize: '16px'}}>visibility</span>
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(app.id)}
                                        >
                                            <span className="material-symbols-outlined" style={{fontSize: '16px'}}>delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {applications.length === 0 && (
                <div className="text-center text-muted py-4">No hay aplicaciones</div>
            )}

            {selectedApplication && (
                <ApplicationDetailModal 
                    application={selectedApplication} 
                    onClose={() => setSelectedApplication(null)} 
                />
            )}
        </div>
    );
}

export default AdminApplicationsTable;
