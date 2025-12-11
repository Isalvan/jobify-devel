import { useState, useEffect } from 'react';
import { jobService } from '../../services/jobService';
import { Link } from 'react-router-dom';

function AdminJobsTable() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            setLoading(true);
            const response = await jobService.getJobs();
            setJobs(response.data || []);
        } catch (err) {
            console.error(err);
            setError('Error al cargar ofertas');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar esta oferta?')) return;
        
        try {
            await jobService.deleteJob(id);
            setJobs(jobs.filter(j => j.id !== id));
        } catch (err) {
            console.error(err);
            alert('Error al eliminar oferta');
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
                            <th>Título</th>
                            <th>Empresa</th>
                            <th>Ubicación</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job.id}>
                                <td>{job.id}</td>
                                <td>
                                    <Link to={`/ofertas/${job.id}`} className="text-decoration-none fw-medium">
                                        {job.titulo}
                                    </Link>
                                </td>
                                <td>{job.empresa?.nombre || 'N/A'}</td>
                                <td>{job.ubicacion}</td>
                                <td>
                                    <span className={`badge ${
                                        job.estado === 'publicado' ? 'bg-success' : 
                                        job.estado === 'cerrado' ? 'bg-danger' : 'bg-secondary'
                                    }`}>
                                        {job.estado}
                                    </span>
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Link 
                                            to={`/ofertas/${job.id}/editar`}
                                            className="btn btn-sm btn-outline-secondary"
                                        >
                                            <span className="material-symbols-outlined" style={{fontSize: '16px'}}>edit</span>
                                        </Link>
                                        <Link 
                                            to={`/ofertas/${job.id}`}
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            <span className="material-symbols-outlined" style={{fontSize: '16px'}}>visibility</span>
                                        </Link>
                                        <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(job.id)}
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
            {jobs.length === 0 && (
                <div className="text-center text-muted py-4">No hay ofertas</div>
            )}
        </div>
    );
}

export default AdminJobsTable;
