import { createContext, useContext, useState, useEffect } from 'react';
import { chatService } from '../services/chatService';
import { ChatToastContainer } from '../components/chat/ChatToast';
import { AppContext } from './AppProvider';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { token } = useContext(AppContext);
    const [unreadCount, setUnreadCount] = useState(0);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toasts, setToasts] = useState([]);

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
            const newCount = data.unread_count;

            // If count increased and we're not on the chat page, notify
            if (newCount > unreadCount && !window.location.pathname.startsWith('/chat')) {
                addToast(`Tienes mensajes sin leer`);
            }

            setUnreadCount(newCount);
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
            // Update unread count from conversations list if available
            const total = data.reduce((acc, conv) => acc + (conv.unread_count || 0), 0);

            if (total > unreadCount && !window.location.pathname.startsWith('/chat')) {
                const latestConv = data.find(c => c.unread_count > 0);
                const senderName = latestConv?.other_user?.nombre || 'Alguien';
                addToast(`Nuevo mensaje de ${senderName}`);
            }

            setUnreadCount(total);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    // Reset state on logout
    useEffect(() => {
        if (!token) {
            setUnreadCount(0);
            setConversations([]);
            setToasts([]);
        } else {
            fetchUnreadCount();
        }
    }, [token]);

    useEffect(() => {
        if (!token) return;

        // Background polling (every 60 seconds)
        const interval = setInterval(fetchUnreadCount, 60000);

        return () => clearInterval(interval);
    }, [token, unreadCount]); // Dependency on unreadCount for the notification logic comparison

    // Listen for custom events to trigger refresh
    useEffect(() => {
        const handleRefresh = () => {
            if (token) fetchUnreadCount();
        };
        window.addEventListener('chat-updated', handleRefresh);
        return () => window.removeEventListener('chat-updated', handleRefresh);
    }, [token, unreadCount]);

    return (
        <ChatContext.Provider value={{
            unreadCount,
            setUnreadCount,
            conversations,
            fetchConversations,
            loading,
            addToast
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
