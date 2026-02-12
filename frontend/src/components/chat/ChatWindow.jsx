import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatService } from '../../services/chatService';
import { useChat } from '../../contexts/ChatContext';
import { AppContext } from '../../contexts/AppProvider';
import { userService } from '../../services/userService';

const ChatWindow = ({ conversationId, initiatingUserId, onMessageSent }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [tempOtherUser, setTempOtherUser] = useState(null); // For when initiating
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null); // Ref para el input de mensaje
    const { conversations } = useChat();
    const { user } = useContext(AppContext); // Get current user
    const navigate = useNavigate();

    const conversation = conversationId ? conversations.find(c => c.id === conversationId) : null;
    const otherUser = conversation?.other_user || tempOtherUser;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const lastId = messages.length > 0 ? messages[messages.length - 1].id : null;
            const data = await chatService.getMessages(conversationId, lastId);

            if (lastId) {
                if (data.length > 0) {
                    setMessages(prev => [...prev, ...data]);
                    // If new messages arrived, trigger a count update
                    window.dispatchEvent(new CustomEvent('chat-updated'));
                }
            } else {
                setMessages(data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        const initNew = async () => {
            if (initiatingUserId) {
                setMessages([]);
                setLoading(true);
                try {
                    const res = await userService.getUserProfile(initiatingUserId);
                    const userData = res.data || res;
                    setTempOtherUser({
                        id: userData.id,
                        nombre: userData.nombre,
                        foto_perfil: userData.foto_perfil
                    });
                } catch (e) {
                    console.error("Error fetching target user", e);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (conversationId) {
            setMessages([]); // Clear previous messages
            fetchMessages();
            // Active polling (every 5 seconds)
            const interval = setInterval(() => fetchMessages(true), 5000);
            return () => clearInterval(interval);
        } else if (initiatingUserId) {
            initNew();
        }
    }, [conversationId, initiatingUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const data = await chatService.sendMessage(newMessage, conversationId, initiatingUserId);
            setNewMessage('');

            if (onMessageSent) onMessageSent(true);

            // If it was a new conversation, navigate to the newly created ID
            if (!conversationId && data.conversacion_id) {
                navigate(`/chat/${data.conversacion_id}`, { replace: true });
            } else {
                await fetchMessages(true);
            }

            // Devolver el foco al input después de enviar
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div className="d-flex align-items-center gap-3">
                    <button className="btn btn-light btn-sm rounded-circle d-md-none me-1" onClick={() => window.history.back()}>
                        <span className="material-symbols-outlined text-dark">arrow_back</span>
                    </button>
                    <div className="position-relative">
                        <img
                            src={otherUser?.foto_perfil || 'https://via.placeholder.com/48'}
                            alt={otherUser?.nombre}
                            className="chat-avatar"
                            style={{ width: '42px', height: '42px' }}
                        />
                    </div>
                    <div>
                        <h6 className="mb-0 fw-bold text-dark">{otherUser?.nombre}</h6>
                    </div>
                </div>
            </div>

            <div className="messages-container">
                {loading && messages.length === 0 ? (
                    <div className="d-flex justify-content-center align-items-center h-100 opacity-50">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                ) : (
                    <>
                        <div className="text-center my-3">
                            <span className="badge bg-light text-secondary fw-normal px-3 py-1 rounded-pill border">
                                Inicio de la conversación
                            </span>
                        </div>
                        {messages.map((msg, index) => {
                            const isMine = user && msg.sender_id === user.id;
                            const isReceived = !isMine;

                            return (
                                <div
                                    key={msg.id}
                                    className={`message-bubble ${isReceived ? 'message-received' : 'message-sent'}`}
                                >
                                    <div className="message-content">{msg.content}</div>
                                    <div className="message-time">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            <div className="chat-input-area">
                <form onSubmit={handleSendMessage} className="d-flex align-items-center gap-2">
                    <div className="chat-input-wrapper flex-grow-1">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Escribe un mensaje..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={sending}
                        />
                        {/* Emoji button could go here */}
                    </div>
                    <button type="submit" className="btn-send shadow-sm" disabled={sending || !newMessage.trim()}>
                        {sending ? (
                            <span className="spinner-border spinner-border-sm text-white" role="status" aria-hidden="true"></span>
                        ) : (
                            <span className="material-symbols-outlined fs-5">send</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
