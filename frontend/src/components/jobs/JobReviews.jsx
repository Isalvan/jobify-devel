import React, { useState, useEffect } from 'react';
import { ratingService } from '../../services/ratingService';
import Paginator from '../common/Paginator';

function JobReviews({ oferta, user, onReviewAdded }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submittingRating, setSubmittingRating] = useState(false);
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

    const handleRatingSubmit = async (e) => {
        e.preventDefault();
        setSubmittingRating(true);
        try {
            await ratingService.createRating({
                trabajo_id: oferta.id,
                puntuacion: rating,
                comentario: comment
            });
            setRatingFeedback({ type: 'success', message: '¡Valoración enviada!' });

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
        <div className="bloque tarjeta valoraciones">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Valoraciones</h2>
                <div className="d-flex align-items-center">
                    <button className="material-symbols-outlined text-warning me-1">star</button>
                    <span className="fw-bold fs-5">{oferta.valoraciones_avg ? parseFloat(oferta.valoraciones_avg).toFixed(1) : '—'}</span>
                    <span className="text-muted ms-2 small">({oferta.valoraciones_count || 0} opiniones)</span>
                </div>
            </div>

            {user?.rol === 'CANDIDATO' ? (
                <div className="bg-light p-3 rounded mb-3">
                    <h5 className="h6 mb-3">Deja tu valoración</h5>
                    {ratingFeedback ? (
                        <div className={`alert alert-${ratingFeedback.type}`}>{ratingFeedback.message}</div>
                    ) : (
                        <form onSubmit={handleRatingSubmit}>
                            <div className="mb-3">
                                <div className="rating-stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={`material-symbols-outlined pointer ${star <= rating ? 'text-warning' : 'text-secondary'}`}
                                            style={{ cursor: 'pointer', fontSize: '24px' }}
                                            onClick={() => setRating(star)}
                                        >
                                            star
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-3">
                                <textarea
                                    className="form-control"
                                    placeholder="Escribe un comentario..."
                                    rows="2"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-sm btn-outline-primary" disabled={submittingRating || rating === 0}>
                                {submittingRating ? 'Enviando...' : 'Publicar valoración'}
                            </button>
                        </form>
                    )}
                </div>
            ) : (
                <p className="text-muted small">Inicia sesión como candidato para valorar esta oferta.</p>
            )}

            {loadingReviews ? (
                <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                </div>
            ) : (
                <>
                    {reviews.length > 0 ? (
                        <div className="mt-4">
                            <h5 className="h6 mb-3">Opiniones recientes</h5>
                            {reviews.map(review => (
                                <div key={review.id} className="border-bottom pb-3 mb-3">
                                    <div className="d-flex justify-content-between mb-1">
                                        <strong>{review.candidato?.usuario?.nombre || 'Usuario'}</strong>
                                        <small className="text-muted">{new Date(review.created_at).toLocaleDateString()}</small>
                                    </div>
                                    <div className="d-flex align-items-center mb-2">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <span key={s} className={`material-symbols-outlined fs-6 ${s <= review.puntuacion ? 'text-warning' : 'text-muted'}`}>star</span>
                                        ))}
                                    </div>
                                    <p className="mb-0 small text-secondary">{review.comentario}</p>
                                </div>
                            ))}

                            <Paginator
                                currentPage={reviewsMeta.current_page}
                                lastPage={reviewsMeta.last_page}
                                onPageChange={setReviewsPage}
                            />
                        </div>
                    ) : (
                        <p className="text-muted text-center py-3">Sé el primero en opinar sobre esta oferta.</p>
                    )}
                </>
            )}
        </div>
    );
}

export default JobReviews;
