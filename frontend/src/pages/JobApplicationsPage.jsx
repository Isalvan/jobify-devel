import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ApplicationsTable from '../components/applications/ApplicationsTable';
import { applicationService } from '../services/applicationService';
import { jobService } from '../services/jobService';

function JobApplicationsPage() {
    const { id } = useParams();
    const [applications, setApplications] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApplications = async () => {
         try {
            const appsRes = await applicationService.getJobApplications(id);
            setApplications(appsRes.data);
        } catch (err) {
            console.error("Error refreshing applications", err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobRes, appsRes] = await Promise.all([
                   jobService.getJob(id),
                   applicationService.getJobApplications(id)
                ]);

                setJob(jobRes.data);
                setApplications(appsRes.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                if (err.message && (err.message.includes('403') || err.message.includes('Unauthorized'))) {
                     setError("No tienes permiso para ver las aplicaciones de esta oferta.");
                } else {
                     setError("Error al cargar las aplicaciones.");
                }
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleUpdateStatus = async (appId, newStatus) => {
        try {
            await applicationService.updateStatus(appId, newStatus);
            // Optimistic update or refresh
            setApplications(prev => prev.map(app => 
                app.id === appId ? { ...app, estado: newStatus } : app
            ));
        } catch (err) {
            console.error(err);
            alert("Error al actualizar el estado de la aplicación.");
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );

    return (
        <div className="container py-5" style={{ maxWidth: '1000px' }}>
            <div className="d-flex align-items-center mb-4">
                 <Link to={`/ofertas/${id}`} className="btn btn-light rounded-circle p-2 me-3 shadow-sm d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                    <span className="material-symbols-outlined text-muted">arrow_back</span>
                </Link>
                <div>
                     <h1 className="h3 fw-bold mb-0 text-gradient">Candidatos</h1>
                     <p className="text-muted mb-0">
                        {job ? `Aplicaciones para "${job.titulo}"` : 'Cargando detalles...'}
                     </p>
                </div>
            </div>

            {error ? (
                <div className="alert alert-danger shadow-sm border-0 rounded-3">
                    <div className="d-flex align-items-center">
                        <span className="material-symbols-outlined me-2">error</span>
                        {error}
                    </div>
                </div>
            ) : (
                <ApplicationsTable 
                    applications={applications} 
                    onUpdateStatus={handleUpdateStatus} 
                />
            )}
        </div>
    );
}

export default JobApplicationsPage;
