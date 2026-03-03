const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'ahora';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const ChatList = ({ conversations, loading, selectedId, onSelect }) => {
    if (loading && conversations.length === 0) {
        return (
            <div className="p-4 text-center">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="p-5 text-center text-muted">
                <p>No tienes conversaciones aún.</p>
            </div>
        );
    }

    return (
        <div className="chat-list-container">
            <div className="p-3 ps-4 border-bottom sticky-top bg-white index-10">
                <h5 className="mb-0 fw-bold text-dark">Mensajes</h5>
            </div>
            {conversations.map((conv) => (
                <div
                    key={conv.id}
                    className={`chat-item d-flex align-items-center gap-3 ${selectedId === conv.id ? 'active' : ''}`}
                    onClick={() => onSelect(conv)}
                >
                    <div className="position-relative">
                        <img
                            src={conv.other_user.foto_perfil || 'https://via.placeholder.com/52'}
                            alt={conv.other_user.nombre}
                            className="chat-avatar"
                        />
                        {/* Online indicator could go here */}
                    </div>

                    <div className="flex-grow-1 overflow-hidden">
                        <div className="d-flex justify-content-between align-items-baseline mb-1">
                            <h6 className="mb-0 text-truncate fw-bold text-dark" style={{ fontSize: '0.95rem' }}>{conv.other_user.nombre}</h6>
                            {conv.last_message && (
                                <small className="text-muted ms-2" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                                    {formatRelativeTime(conv.last_message.created_at)}
                                </small>
                            )}
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <p className={`mb-0 text-truncate small ${conv.unread_count > 0 ? 'fw-bold text-dark' : 'text-muted'}`} style={{ maxWidth: '85%' }}>
                                {conv.unread_count > 0 ? (
                                    <span className="text-primary">{conv.last_message ? conv.last_message.content : 'Sin mensajes'}</span>
                                ) : (
                                    conv.last_message ? conv.last_message.content : 'Sin mensajes'
                                )}
                            </p>
                            {conv.unread_count > 0 && (
                                <span className="unread-badge shadow-sm">{conv.unread_count}</span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChatList;
