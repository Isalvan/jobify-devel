import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

let echoInstance = null;

export const getEcho = () => {
    if (echoInstance) return echoInstance;

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) return null;

    echoInstance = new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY || 'my-app-key',
        wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
        wsPort: import.meta.env.VITE_REVERB_PORT || 80,
        wssPort: import.meta.env.VITE_REVERB_PORT || 443,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
        authEndpoint: '/api/broadcasting/auth',
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        },
    });

    return echoInstance;
};

export const destroyEcho = () => {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
    }
};
