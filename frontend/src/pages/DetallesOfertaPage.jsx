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

import './css/DetallesOfertaPage.css';

function DetallesOfertaPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AppContext);

    const [oferta, setOferta] = useState(location.state?.oferta || null);
    const [loading, setLoading] = useState(!oferta);
    const [error, setError] = useState(null);

    // Application Modal State
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
                // Note: Rating state is now handled inside JobReviews
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
            await applicationService.applyToJob(oferta.id, mensaje, applicationCvFile, useProfileCv);
            setApplyFeedback({ type: 'success', message: '¡Has aplicado correctamente a esta oferta!' });

            setOferta(prev => ({
                ...prev,
                mi_aplicacion: true
            }));

            setTimeout(() => {
                setShowModal(false);
                setMensaje('');
            }, 2000);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 409) {
                setApplyFeedback({ type: 'warning', message: 'Ya has aplicado anteriormente a esta oferta.' });
                setOferta(prev => ({ ...prev, mi_aplicacion: true }));
            } else {
                setApplyFeedback({ type: 'danger', message: 'Ocurrió un error al aplicar. Inténtalo de nuevo.' });
            }
        } finally {
            setApplying(false);
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
        // Reload job to get updated stats
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
        <div className="detalles-container">
            <div className="detalles-main">
                <JobHeader
                    oferta={oferta}
                    onToggleFavorite={handleToggleFavorite}
                    onApply={handleApplyClick}
                />

                <JobDetails oferta={oferta} />

                <JobReviews
                    oferta={oferta}
                    user={user}
                    onReviewAdded={handleReviewAdded}
                />
            </div>

            <JobSidebar oferta={oferta} />

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
