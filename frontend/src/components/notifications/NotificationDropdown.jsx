import { useState, useEffect, useRef, useContext } from 'react';
import { api } from '../../utils/api';
import { Link } from 'react-router-dom';
import { useChat } from '../../contexts/ChatContext';
import './notifications.css';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const { isSocketConnected } = useChat();
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await api.get('/notifications');
            setNotifications(response.data);
            setUnreadCount(response.unread_count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();

        const handleWsNotification = (e) => {
            console.log('Notification received via WebSocket:', e.detail);
            fetchNotifications(); // Refresh to get the latest data structure
        };

        window.addEventListener('notification-received', handleWsNotification);

        return () => {
            window.removeEventListener('notification-received', handleWsNotification);
        };
    }, []);

    useEffect(() => {
        // Fallback polling only if socket is NOT connected
        let interval = null;
        if (!isSocketConnected) {
            console.log('Starting notification polling (socket disconnected)');
            interval = setInterval(fetchNotifications, 60000);
        } else {
            console.log('Stopping notification polling (socket connected)');
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isSocketConnected]);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, read_at: new Date().toISOString() } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
            window.dispatchEvent(new CustomEvent('notifications-updated'));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })));
            setUnreadCount(0);
            window.dispatchEvent(new CustomEvent('notifications-updated'));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            const updatedNotifications = notifications.filter(n => n.id !== id);
            setNotifications(updatedNotifications);
            setUnreadCount(updatedNotifications.filter(n => !n.read_at).length);
            window.dispatchEvent(new CustomEvent('notifications-updated'));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    useEffect(() => {
        const handleSync = () => fetchNotifications();
        window.addEventListener('notifications-updated', handleSync);
        return () => window.removeEventListener('notifications-updated', handleSync);
    }, []);

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="dropdown me-3" ref={dropdownRef}>
            <button
                className="btn btn-link position-relative p-2 text-decoration-none notification-bell"
                type="button"
                id="notificationDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <span className="material-symbols-outlined text-muted fs-4">notifications</span>
                {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-sm">
                        {unreadCount > 9 ? '9+' : unreadCount}
                        <span className="visually-hidden">unread notifications</span>
                    </span>
                )}
            </button>

            <div className="dropdown-menu dropdown-menu-end notification-dropdown shadow-lg border-0 p-0" aria-labelledby="notificationDropdown">
                <div className="notification-header d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h6 className="mb-0 fw-bold">Notificaciones</h6>
                    {unreadCount > 0 && (
                        <button className="btn btn-link btn-sm text-primary p-0 text-decoration-none fw-semibold" onClick={markAllAsRead}>
                            Marcar todas como leídas
                        </button>
                    )}
                </div>

                <div className="notification-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {loading && notifications.length === 0 ? (
                        <div className="p-4 text-center">
                            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                        </div>
                    ) : notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`notification-item border-bottom transition-all ${!notification.read_at ? 'unread' : ''}`}
                            >
                                <div className="d-flex align-items-stretch">
                                    <Link
                                        to={notification.data.url || '#'}
                                        className="text-decoration-none text-dark p-3 flex-grow-1"
                                        onClick={() => !notification.read_at && markAsRead(notification.id)}
                                    >
                                        <div className="d-flex gap-3">
                                            <div className="notification-icon flex-shrink-0">
                                                <div className={`rounded-circle p-2 d-flex align-items-center justify-content-center ${notification.type.includes('JobApplied') ? 'bg-primary-subtle text-primary' : 'bg-success-subtle text-success'}`}>
                                                    <span className="material-symbols-outlined fs-5">
                                                        {notification.type.includes('JobApplied') ? 'work' : 'campaign'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <p className="mb-1 small fw-semibold text-break">
                                                    {notification.data.mensaje}
                                                </p>
                                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                    {formatDate(notification.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                    <button
                                        className="btn-delete-notification d-flex align-items-center justify-content-center text-muted hover-danger transition-all border-start"
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteNotification(notification.id); }}
                                        title="Eliminar"
                                    >
                                        <span className="material-symbols-outlined fs-5">close</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-5 text-center">
                            <span className="material-symbols-outlined text-muted fs-1 mb-2 opacity-25">notifications_off</span>
                            <p className="text-muted small mb-0">No tienes notificaciones</p>
                        </div>
                    )}
                </div>

                <div className="notification-footer p-2 text-center border-top">
                    <Link to="/notificaciones" className="text-decoration-none small fw-semibold text-primary">Ver todas</Link>
                </div>
            </div>
        </div>
    );
};

export default NotificationDropdown;
