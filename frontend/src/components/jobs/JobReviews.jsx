import React, { useState, useEffect } from 'react';
import { ratingService } from '../../services/ratingService';
import Paginator from '../common/Paginator';

function JobReviews({ oferta, user, onReviewAdded }) {
    // Initialize with existing rating if available
    const [rating, setRating] = useState(oferta?.mi_valoracion?.puntuacion || 0);
    const [comment, setComment] = useState(oferta?.mi_valoracion?.comentario || '');
    const [submittingRating, setSubmittingRating] = useState(false);
    const [deletingRating, setDeletingRating] = useState(false);
    const [ratingFeedback, setRatingFeedback] = useState(null);

    const [reviews, setReviews] = useState([]);
    const [reviewsMeta, setReviewsMeta] = useState({});
    const [reviewsPage, setReviewsPage] = useState(1);
    const [loadingReviews, setLoadingReviews] = useState(false);

    useEffect(() => {
        if (oferta?.id) {
            loadReviews(reviewsPage);
        }
    }, [oferta?.id, reviewsPage]);

    // Update state if oferta changes (e.g. after refresh)
    useEffect(() => {
        if (oferta?.mi_valoracion) {
            setRating(oferta.mi_valoracion.puntuacion);
            setComment(oferta.mi_valoracion.comentario);
        }
    }, [oferta?.mi_valoracion]);

    const loadReviews = (page) => {
        setLoadingReviews(true);
        ratingService.getJobRatings(oferta.id, page)
            .then(data => {
                setReviews(data.data);
                setReviewsMeta(data.meta);
            })
            .catch(err => console.error("Error loading reviews", err))
            .finally(() => setLoadingReviews(false));
    };

    const handleDeleteRating = async () => {
        if (!oferta.mi_valoracion) return;
        if (!window.confirm("¿Estás seguro de que quieres eliminar tu valoración?")) return;

        setDeletingRating(true);
        try {
            await ratingService.deleteRating(oferta.mi_valoracion.id);
            setRatingFeedback({ type: 'success', message: 'Valoración eliminada correctamente.' });
            
            // Allow parent to refresh data (crucial to remove mi_valoracion from oferta prop)
            if (onReviewAdded) onReviewAdded();
            
            setRating(0);
            setComment('');
            loadReviews(1);
        } catch (error) {
            console.error(error);
            setRatingFeedback({ type: 'danger', message: 'Error al eliminar la valoración.' });
        } finally {
            setDeletingRating(false);
        }
    };

    const handleRatingSubmit = async (e) => {
        e.preventDefault();
        setSubmittingRating(true);
        try {
            await ratingService.createRating({
                trabajo_id: oferta.id,
                puntuacion: rating,
                comentario: comment
            });
            
            const isUpdate = !!oferta.mi_valoracion;
            setRatingFeedback({ type: 'success', message: isUpdate ? '¡Valoración actualizada!' : '¡Valoración enviada!' });

            loadReviews(1);
            setReviewsPage(1);
            setRating(0);
            setComment('');

            if (onReviewAdded) onReviewAdded();

        } catch (error) {
            if (error.response && (error.response.status === 409 || error.response.status === 403)) {
                setRatingFeedback({ type: 'warning', message: error.response.data.message });
            } else {
                setRatingFeedback({ type: 'danger', message: 'Error al enviar la valoración.' });
            }
        } finally {
            setSubmittingRating(false);
        }
    };

    if (!oferta) return null;

    return (
        <div className="card-premium p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="h5 fw-bold mb-0 d-flex align-items-center gap-2">
                    <span className="material-symbols-outlined text-primary">star</span>
                    Valoraciones
                </h3>
                <div className="d-flex align-items-center bg-light px-3 py-1 rounded-pill border">
                    <span className="fw-bold fs-5 text-dark me-1">{oferta.valoraciones_avg ? parseFloat(oferta.valoraciones_avg).toFixed(1) : '—'}</span>
                    <span className="material-symbols-outlined text-warning me-2">star</span>
                    <span className="text-muted small border-start ps-2">({oferta.valoraciones_count || 0})</span>
                </div>
            </div>

            {user?.rol === 'CANDIDATO' ? (
                <div className="bg-light p-4 rounded-3 mb-4 border-start border-4 border-primary shadow-sm">
                    <h5 className="h6 fw-bold mb-3">Comparte tu experiencia</h5>
                    {ratingFeedback ? (
                        <div className={`alert alert-${ratingFeedback.type} py-2 small`}>{ratingFeedback.message}</div>
                    ) : (
                        <form onSubmit={handleRatingSubmit}>
                            <div className="mb-3">
                                <label className="form-label small text-muted mb-1">Tu puntuación</label>
                                <div className="rating-stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={`material-symbols-outlined pointer ${star <= rating ? 'text-warning' : 'text-muted opacity-25'}`}
                                            style={{ cursor: 'pointer', fontSize: '28px', transition: 'all 0.2s' }}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        >
                                            star
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-3">
                                <textarea
                                    className="form-control border-0 shadow-sm"
                                    placeholder="¿Qué te pareció este empleo? Escribe un comentario..."
                                    rows="3"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                {oferta.mi_valoracion && (
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-danger btn-sm rounded-pill"
                                        onClick={handleDeleteRating}
                                        disabled={deletingRating || submittingRating}
                                    >
                                        {deletingRating ? 'Eliminando...' : 'Eliminar valoración'}
                                    </button>
                                )}
                                <button type="submit" className={`btn btn-primary btn-sm px-3 rounded-pill ${!oferta.mi_valoracion ? 'ms-auto' : ''}`} disabled={submittingRating || rating === 0}>
                                    {submittingRating ? 'Enviando...' : (oferta.mi_valoracion ? 'Actualizar valoración' : 'Publicar valoración')}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            ) : (
                <div className="alert alert-light border text-center text-muted small mb-4">
                    Inicia sesión como candidato para valorar esta oferta.
                </div>
            )}

            {loadingReviews ? (
                <div className="text-center py-5">
                    <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                </div>
            ) : (
                <>
                    {reviews.length > 0 ? (
                        <div className="d-flex flex-column gap-3">
                            {reviews.map(review => (
                                <div key={review.id} className="border-bottom pb-3">
                                    <div className="d-flex justify-content-between mb-1">
                                        <strong className="text-dark small">{review.candidato?.usuario?.nombre || 'Usuario Anónimo'}</strong>
                                        <small className="text-muted fst-italic" style={{fontSize: '0.75rem'}}>{new Date(review.created_at).toLocaleDateString()}</small>
                                    </div>
                                    <div className="d-flex align-items-center mb-2">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <span key={s} className={`material-symbols-outlined ${s <= review.puntuacion ? 'text-warning' : 'text-muted opacity-25'}`} style={{fontSize: '16px'}}>star</span>
                                        ))}
                                    </div>
                                    <p className="mb-0 small text-secondary">{review.comentario}</p>
                                </div>
                            ))}

                            <div className="mt-3 d-flex justify-content-center">
                                <Paginator
                                    currentPage={reviewsMeta.current_page}
                                    lastPage={reviewsMeta.last_page}
                                    onPageChange={setReviewsPage}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-5 opacity-50">
                            <span className="material-symbols-outlined fs-1 text-muted mb-2">rate_review</span>
                            <p className="text-muted small">Aún no hay valoraciones para esta oferta.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default JobReviews;
