import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { AppContext } from '../contexts/AppProvider';

import JobHeader from '../components/jobs/JobHeader';
import JobDetails from '../components/jobs/JobDetails';
import JobSidebar from '../components/jobs/JobSidebar';
import JobReviews from '../components/jobs/JobReviews';
import ApplicationModal from '../components/jobs/ApplicationModal';



function DetallesOfertaPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AppContext);

    const [oferta, setOferta] = useState(location.state?.oferta || null);
    const [loading, setLoading] = useState(!oferta);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [useProfileCv, setUseProfileCv] = useState(false);
    const [applicationCvFile, setApplicationCvFile] = useState(null);
    const [applying, setApplying] = useState(false);
    const [applyFeedback, setApplyFeedback] = useState(null);

    useEffect(() => {
        setLoading(true);
        jobService.getJob(id)
            .then(data => {
                setOferta(data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("No se pudo cargar la oferta.");
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (showModal && user?.candidato?.url_cv) {
            setUseProfileCv(true);
        } else if (showModal) {
            setUseProfileCv(false);
        }
    }, [showModal, user]);

    const handleApplyClick = () => {
        if (!user) {
            navigate('/login', { state: { returnUrl: location.pathname } });
            return;
        }
        setShowModal(true);
        setApplyFeedback(null);
    };

    const confirmApply = async () => {
        setApplying(true);
        try {
            const response = await applicationService.applyToJob(oferta.id, mensaje, applicationCvFile, useProfileCv);
            setApplyFeedback({ type: 'success', message: '¡Has aplicado correctamente a esta oferta!' });

            setOferta(prev => ({
                ...prev,
                mi_aplicacion: response.data || response // Store full object, fallback if not wrapped
            }));

            setTimeout(() => {
                setShowModal(false);
                setMensaje('');
            }, 2000);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 409) {
                setApplyFeedback({ type: 'warning', message: 'Ya has aplicado anteriormente a esta oferta.' });
                // We don't have the application ID here easily unless we fetch it, but let's assume valid state
                // If 409, we might want to fetch the job again to get the application ID?
                // For now, let's just set it to true which might be partial
                // Ideally reload the job:
                 const updatedJob = await jobService.getJob(oferta.id);
                 setOferta(updatedJob.data);
            } else {
                setApplyFeedback({ type: 'danger', message: error.message || 'Ocurrió un error al aplicar. Inténtalo de nuevo.' });
            }
        } finally {
            setApplying(false);
        }
    };

    const handleWithdraw = async () => {
        if (!oferta.mi_aplicacion) return;
        
        // Handle edge case where mi_aplicacion might be just "true" (legacy/error state)
        // ideally we need the ID.
        // If it's a boolean true, we can't delete without ID.
        // But since we updated confirmApply to set data, and initial load gets data, we should be good.
        // Fallback: reload page if ID missing?
        const applicationId = oferta.mi_aplicacion?.id || oferta.mi_aplicacion; // fallback if it was just ID
        
        if (typeof applicationId !== 'number' && typeof applicationId !== 'string') {
            console.error("Cannot withdraw: Missing application ID");
            alert("Error: No se pudo identificar la candidatura para retirar. Por favor recarga la página.");
            return;
        }

        if (window.confirm('¿Estás seguro de que quieres eliminar tu candidatura de esta oferta?')) {
             try {
                 await applicationService.deleteApplication(applicationId);
                 setOferta(prev => ({ ...prev, mi_aplicacion: null }));
             } catch (error) {
                 console.error(error);
                 alert('Error al retirar la candidatura.');
             }
        }
    };

    const handleToggleFavorite = async () => {
        if (!user) {
            navigate('/login', { state: { returnUrl: location.pathname } });
            return;
        }
        try {
            const response = await jobService.toggleFavorite(oferta.id);
            setOferta(prev => ({ ...prev, is_favorito: response.is_favorito }));
        } catch (error) {
            console.error(error);
        }
    };

    const handleReviewAdded = async () => {
        const updatedJob = await jobService.getJob(oferta.id);
        setOferta(updatedJob.data);
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );

    if (error || !oferta) return (
        <div className="container py-5 text-center">
            <h2>{error || "Oferta no encontrada"}</h2>
            <Link to="/ofertas" className="btn btn-primary mt-3">Volver a buscar</Link>
        </div>
    );

    return (
        <div className="container py-5">
            <div className="row g-4">
                <div className="col-12 col-lg-8">
                    <JobHeader
                        oferta={oferta}
                        user={user}
                        onToggleFavorite={handleToggleFavorite}
                        onApply={handleApplyClick}
                        onWithdraw={handleWithdraw}
                    />

                    <JobDetails oferta={oferta} />

                    <JobReviews
                        oferta={oferta}
                        user={user}
                        onReviewAdded={handleReviewAdded}
                    />
                </div>

                <div className="col-12 col-lg-4">
                    <div className="sticky-top" style={{ top: '6rem', zIndex: 100 }}>
                        <JobSidebar oferta={oferta} />
                    </div>
                </div>
            </div>

            <ApplicationModal
                show={showModal}
                onClose={() => setShowModal(false)}
                oferta={oferta}
                user={user}
                onConfirm={confirmApply}
                applyFeedback={applyFeedback}
                applying={applying}
                useProfileCv={useProfileCv}
                setUseProfileCv={setUseProfileCv}
                setApplicationCvFile={setApplicationCvFile}
                mensaje={mensaje}
                setMensaje={setMensaje}
            />
        </div>
    );
}

export default DetallesOfertaPage;
