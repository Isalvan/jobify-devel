import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import { useChat } from '../contexts/ChatContext';
import { chatService } from '../services/chatService';
import './chat.css';

const ChatPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { conversations, fetchConversations, loading, isSocketConnected } = useChat();
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [initiatingUserId, setInitiatingUserId] = useState(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const userId = queryParams.get('user_id');
        const newUserId = queryParams.get('new_user_id');

        if (userId) {
            handleInitiateChat(parseInt(userId));
        } else if (newUserId) {
            setInitiatingUserId(parseInt(newUserId));
        } else {
            setInitiatingUserId(null);
        }
    }, [location.search]);

    const handleInitiateChat = async (userId) => {
        try {
            // Check if conversation already exists
            const existing = conversations.find(c => c.other_user.id === userId);
            if (existing) {
                navigate(`/chat/${existing.id}`, { replace: true });
                return;
            }

            // If it doesn't exist, we don't send a message yet.
            // We just set a state to tell ChatWindow we are starting a new one.
            setInitiatingUserId(userId);
            // Navigate to base chat but keep the intention
            navigate(`/chat?new_user_id=${userId}`, { replace: true });
        } catch (error) {
            console.error('Error initiating chat:', error);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        // Fallback polling only if socket is NOT connected
        let interval = null;
        if (!isSocketConnected) {
            console.log('Starting chat list polling (socket disconnected)');
            interval = setInterval(() => fetchConversations(true), 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isSocketConnected]);

    useEffect(() => {
        if (id && conversations.length > 0) {
            const conv = conversations.find(c => c.id === parseInt(id));
            if (conv) {
                setSelectedConversation(conv);
            }
        } else if (!id) {
            setSelectedConversation(null);
        }
    }, [id, conversations]);

    const handleSelectConversation = (conv) => {
        navigate(`/chat/${conv.id}`);
    };

    return (
        <div className="container-fluid chat-layout p-0">
            <div className="row g-0 h-100">
                <div className={`col-12 col-md-4 col-lg-3 chat-sidebar-col h-100 ${id ? 'd-none d-md-block' : ''}`}>
                    <ChatList
                        conversations={conversations}
                        loading={loading}
                        selectedId={id ? parseInt(id) : null}
                        onSelect={handleSelectConversation}
                    />
                </div>
                <div className={`col-12 col-md-8 col-lg-9 chat-window-col h-100 ${!id && !initiatingUserId ? 'd-none d-md-block' : ''}`}>
                    {id || initiatingUserId ? (
                        <ChatWindow
                            conversationId={id ? parseInt(id) : null}
                            initiatingUserId={initiatingUserId}
                            onMessageSent={fetchConversations}
                        />
                    ) : (
                        <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted bg-light empty-chat-state">
                            <span className="material-symbols-outlined fs-1 mb-3 opacity-25" style={{ fontSize: '5rem' }}>forum</span>
                            <h4>Tus Mensajes</h4>
                            <p>Selecciona una conversación para empezar a chatear</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
