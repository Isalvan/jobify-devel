import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { chatService } from '../services/chatService';
import { ChatToastContainer } from '../components/chat/ChatToast';
import { AppContext } from './AppProvider';
import { getEcho, destroyEcho } from '../utils/echo';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { token, user } = useContext(AppContext);
    const [unreadCount, setUnreadCount] = useState(0);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const echoRef = useRef(null);

    const addToast = (message) => {
        const id = Date.now();
        setToasts(prev => [...prev.slice(-2), { id, message }]); // Keep max 3
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const fetchUnreadCount = async () => {
        if (!token) return;
        try {
            const data = await chatService.getUnreadCount();
            setUnreadCount(data.unread_count);
        } catch (error) {
            console.error('Error fetching chat unread count:', error);
        }
    };

    const fetchConversations = async (silent = false) => {
        if (!token) return;
        if (!silent) setLoading(true);
        try {
            const data = await chatService.getConversations();
            setConversations(data);
            const total = data.reduce((acc, conv) => acc + (conv.unread_count || 0), 0);
            setUnreadCount(total);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    // WebSocket implementation
    useEffect(() => {
        if (!token || !user) {
            destroyEcho();
            echoRef.current = null;
            setIsSocketConnected(false);
            return;
        }

        const echo = getEcho();
        if (!echo) return;
        echoRef.current = echo;

        echo.connector.pusher.connection.bind('connected', () => {
            console.log('Chat WebSocket connected');
            setIsSocketConnected(true);
        });

        echo.connector.pusher.connection.bind('disconnected', () => {
            console.log('Chat WebSocket disconnected');
            setIsSocketConnected(false);
        });

        // Listen for notifications and messages
        const channel = echo.private(`App.Models.Usuario.${user.id}`);

        channel.notification((notification) => {
            console.log('Notification received:', notification);
            window.dispatchEvent(new CustomEvent('notification-received', { detail: notification }));
            fetchUnreadCount();
            if (window.location.pathname.startsWith('/chat')) fetchConversations(true);
        });

        channel.listen('.message.sent', (e) => {
            console.log('Global message event received:', e.mensaje);
            // Refresh counts if it's not the active conversation (active window handles its own)
            fetchUnreadCount();
            if (window.location.pathname.startsWith('/chat')) fetchConversations(true);

            // Add toast if not on chat page
            if (!window.location.pathname.startsWith('/chat')) {
                addToast(`Nuevo mensaje de ${e.mensaje.sender.nombre}`);
            }
        });

        return () => {
            if (user && echo) {
                echo.leave(`App.Models.Usuario.${user.id}`);
            }
        };
    }, [token, user]);

    // Reset state on logout
    useEffect(() => {
        if (!token) {
            setUnreadCount(0);
            setConversations([]);
            setToasts([]);
            destroyEcho();
            echoRef.current = null;
            setIsSocketConnected(false);
        } else {
            fetchUnreadCount();
        }
    }, [token]);

    // Fallback polling: only if socket is NOT connected
    useEffect(() => {
        if (!token) return;

        let interval = null;
        if (!isSocketConnected) {
            console.log('Starting global polling fallback');
            interval = setInterval(fetchUnreadCount, 60000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [token, isSocketConnected]);

    // Listen for custom events to trigger refresh
    useEffect(() => {
        const handleRefresh = () => {
            if (token) {
                fetchUnreadCount();
                if (window.location.pathname.startsWith('/chat')) {
                    fetchConversations(true);
                }
            }
        };
        window.addEventListener('chat-updated', handleRefresh);
        return () => window.removeEventListener('chat-updated', handleRefresh);
    }, [token]);

    return (
        <ChatContext.Provider value={{
            unreadCount,
            setUnreadCount,
            conversations,
            setConversations,
            fetchConversations,
            loading,
            addToast,
            isSocketConnected,
            echo: echoRef.current
        }}>
            {children}
            <ChatToastContainer toasts={toasts} onRemove={removeToast} />
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
