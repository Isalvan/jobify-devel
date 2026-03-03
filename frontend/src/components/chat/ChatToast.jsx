import { useState, useEffect } from 'react';
import './chat-toast.css';
import { useNavigate } from 'react-router-dom';

const ChatToast = ({ toast, onRemove }) => {
    const [exiting, setExiting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            handleRemove();
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleRemove = () => {
        setExiting(true);
        setTimeout(() => onRemove(toast.id), 300);
    };

    const handleClick = () => {
        navigate('/chat');
        handleRemove();
    };

    return (
        <div className={`chat-toast ${exiting ? 'exiting' : ''}`} onClick={handleClick}>
            <div className="chat-toast-icon">
                <span className="material-symbols-outlined">forum</span>
            </div>
            <div className="chat-toast-content">
                <div className="chat-toast-title">Nuevo mensaje</div>
                <div className="chat-toast-body">{toast.message}</div>
            </div>
            <button className="btn-close" style={{ fontSize: '0.6rem' }} onClick={(e) => {
                e.stopPropagation();
                handleRemove();
            }}></button>
        </div>
    );
};

export const ChatToastContainer = ({ toasts, onRemove }) => {
    return (
        <div className="chat-toast-container">
            {toasts.map(toast => (
                <ChatToast key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
};

export default ChatToast;
