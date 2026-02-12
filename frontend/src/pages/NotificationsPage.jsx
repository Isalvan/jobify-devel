import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Link } from 'react-router-dom';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });

    const fetchNotifications = async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`/notifications?page=${page}&per_page=20`);
            setNotifications(response.data);
            setPagination({
                current_page: response.current_page,
                last_page: response.last_page
            });
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();

        const handleSync = () => fetchNotifications(pagination.current_page);
        window.addEventListener('notifications-updated', handleSync);
        return () => window.removeEventListener('notifications-updated', handleSync);
    }, [pagination.current_page]);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, read_at: new Date().toISOString() } : n
            ));
            window.dispatchEvent(new CustomEvent('notifications-updated'));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })));
            window.dispatchEvent(new CustomEvent('notifications-updated'));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n.id !== id));
            window.dispatchEvent(new CustomEvent('notifications-updated'));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const formatDate = (dateString) => {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-8">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="h3 fw-bold mb-0 text-gradient">Centro de Notificaciones</h1>
                        {notifications.some(n => !n.read_at) && (
                            <button
                                className="btn btn-outline-primary btn-sm rounded-pill px-3"
                                onClick={markAllAsRead}
                            >
                                Marcar todas como leídas
                            </button>
                        )}
                    </div>

                    <div className="card-premium p-0 overflow-hidden shadow-sm">
                        {loading && notifications.length === 0 ? (
                            <div className="p-5 text-center">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="mt-2 text-muted">Cargando notificaciones...</p>
                            </div>
                        ) : notifications.length > 0 ? (
                            <div className="list-group list-group-flush">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`list-group-item list-group-item-action p-4 border-start-0 border-end-0 transition-all ${!notification.read_at ? 'bg-light' : ''}`}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="d-flex gap-4 align-items-center">
                                            <div className="notification-icon-large flex-shrink-0">
                                                <div className={`rounded-circle p-3 d-flex align-items-center justify-content-center ${notification.type.includes('JobApplied') ? 'bg-primary-subtle text-primary' : 'bg-success-subtle text-success'}`}>
                                                    <span className="material-symbols-outlined fs-3">
                                                        {notification.type.includes('JobApplied') ? 'work' : 'campaign'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-start mb-1">
                                                    <Link
                                                        to={notification.data.url || '#'}
                                                        className="text-decoration-none text-dark flex-grow-1"
                                                        onClick={() => !notification.read_at && markAsRead(notification.id)}
                                                    >
                                                        <h6 className={`mb-1 ${!notification.read_at ? 'fw-bold' : 'fw-semibold'}`}>
                                                            {notification.data.mensaje}
                                                        </h6>
                                                        <p className="text-muted small mb-0">
                                                            {formatDate(notification.created_at)}
                                                        </p>
                                                    </Link>

                                                    <div className="d-flex gap-2 ms-3 align-items-center flex-shrink-0">
                                                        {!notification.read_at && (
                                                            <button
                                                                className="btn btn-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm text-primary transition-all"
                                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); markAsRead(notification.id); }}
                                                                title="Marcar como leída"
                                                                style={{ width: '38px', height: '38px', border: '1px solid #e2e8f0' }}
                                                            >
                                                                <span className="material-symbols-outlined fs-5">done_all</span>
                                                            </button>
                                                        )}
                                                        <button
                                                            className="btn btn-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm text-danger transition-all"
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteNotification(notification.id); }}
                                                            title="Eliminar notificación"
                                                            style={{ width: '38px', height: '38px', border: '1px solid #e2e8f0' }}
                                                        >
                                                            <span className="material-symbols-outlined fs-5">delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-5 text-center my-5">
                                <span className="material-symbols-outlined text-muted fs-1 mb-3 opacity-25" style={{ fontSize: '5rem' }}>notifications_off</span>
                                <h4 className="text-muted fw-normal">No tienes notificaciones por ahora</h4>
                                <p className="text-muted mb-4 text-balanced">Te avisaremos cuando haya novedades sobre tus candidaturas u ofertas.</p>
                                <Link to="/" className="btn-premium px-4">Ir al inicio</Link>
                            </div>
                        )}

                        {pagination.last_page > 1 && (
                            <div className="p-4 border-top bg-light d-flex justify-content-center gap-2">
                                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        className={`btn btn-sm rounded-circle shadow-sm ${pagination.current_page === page ? 'btn-primary' : 'btn-white text-primary'}`}
                                        style={{ width: '35px', height: '35px', padding: 0 }}
                                        onClick={() => fetchNotifications(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
