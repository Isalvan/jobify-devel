import { useState, useEffect, useContext } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { userService } from '../services/userService';
import { AppContext } from '../contexts/AppProvider';
import Paginator from '../components/common/Paginator';
import JobCard from '../components/jobs/JobCard';

export default function EmpresaOfertasPage() {
    const { id } = useParams();
    const { user } = useContext(AppContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const page = parseInt(searchParams.get('page')) || 1;
    const [jobs, setJobs] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [empresa, setEmpresa] = useState(null);

    // Determine which company ID to use
    // If id is present in URL, use it. Otherwise, if logged in user is EMPRESA, use their company ID.
    const targetEmpresaId = id || (user?.rol === 'EMPRESA' ? user.empresa?.id : null);

    useEffect(() => {
        if (!targetEmpresaId) {
            setError("No se ha especificado ninguna empresa.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch company details to show name in header
                const companyRes = await userService.getUserProfile(id ? null : user.id, id);
                // Note: userService.getUserProfile logic might need adjustment depending on how it works.
                // For now, let's try to get profile if it's the current user, or specific user if ID provided.
                // Actually, if we have targetEmpresaId which is the RELATION ID (empresa.id), 
                // we might need a way to get the company name.

                const data = await jobService.getJobs({
                    empresa_id: targetEmpresaId,
                    page: page
                });

                setJobs(data.data);
                setMeta(data.meta);

                if (data.data.length > 0) {
                    setEmpresa(data.data[0].empresa);
                }
            } catch (err) {
                console.error(err);
                setError("Error al cargar las ofertas de la empresa.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [targetEmpresaId, page]);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > meta.last_page) return;
        setSearchParams({ page: newPage });
        window.scrollTo(0, 0);
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="container py-5 text-center">
            <div className="card-premium p-5">
                <span className="material-symbols-outlined text-danger mb-3" style={{ fontSize: '48px' }}>error</span>
                <h2 className="h4 fw-bold mb-3">{error}</h2>
                <button onClick={() => navigate(-1)} className="btn btn-premium px-4">Volver</button>
            </div>
        </div>
    );

    return (
        <div className="container py-5">
            <header className="mb-5">
                <div className="d-flex align-items-center gap-3 mb-2">
                    <button onClick={() => navigate(-1)} className="btn btn-link p-0 text-decoration-none d-flex align-items-center text-primary">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="h3 fw-bold mb-0 text-gradient">
                        Ofertas de {empresa?.nombre || 'la empresa'}
                    </h1>
                </div>
                <p className="text-muted ms-5">
                    Gestiona y visualiza todas las vacantes publicadas por esta empresa.
                </p>
            </header>

            <div className="row g-4">
                <div className="col-12">
                    {jobs.length > 0 ? (
                        <>
                            <div className="d-flex flex-column gap-3">
                                {jobs.map(job => (
                                    <JobCard
                                        key={job.id}
                                        job={job}
                                        hideCompany={true}
                                    />
                                ))}
                            </div>

                            <div className="mt-5 d-flex justify-content-center">
                                <Paginator
                                    currentPage={meta.current_page}
                                    lastPage={meta.last_page}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="card-premium p-5 text-center">
                            <span className="material-symbols-outlined text-muted mb-3" style={{ fontSize: '48px' }}>work_off</span>
                            <h3 className="h5 text-muted">No hay ofertas publicadas de esta empresa en este momento.</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
