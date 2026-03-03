import { api } from '../utils/api';

export const chatService = {
    /**
     * Get all conversations.
     */
    getConversations: () => api.get('/chat'),

    /**
     * Get global unread count.
     */
    getUnreadCount: () => api.get('/chat/unread-count'),

    /**
     * Get messages for a conversation.
     * @param {number} conversationId 
     * @param {number|null} afterId - Optional ID to fetch messages after.
     */
    getMessages: (conversationId, afterId = null) => {
        const url = `/chat/${conversationId}${afterId ? `?after_id=${afterId}` : ''}`;
        return api.get(url);
    },

    /**
     * Send a message.
     */
    sendMessage: (content, conversationId = null, recipientId = null) => {
        const body = { content };
        if (conversationId) body.conversacion_id = conversationId;
        if (recipientId) body.recipient_id = recipientId;
        return api.post('/chat', body);
    }
};
