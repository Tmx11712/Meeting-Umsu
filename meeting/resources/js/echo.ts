import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

if (typeof window !== 'undefined') {
    window.Pusher = Pusher;

    const isHttps = window.location.protocol === 'https:' || import.meta.env.VITE_REVERB_SCHEME === 'https';

    // Dynamically connect to the host the user is browsing on,
    // ensuring WebSockets work seamlessly on localhost, LAN IP (192.168.x.x), Tailscale (100.x.x.x), and domain names.
    const wsHost = (import.meta.env.VITE_REVERB_HOST && import.meta.env.VITE_REVERB_HOST !== 'localhost')
        ? import.meta.env.VITE_REVERB_HOST
        : window.location.hostname;

    // In production behind Nginx reverse proxy, port 80/443 forwards /app to Reverb 8080.
    const wsPort = window.location.port
        ? Number(window.location.port)
        : (isHttps ? 443 : 80);

    const appKey = import.meta.env.VITE_REVERB_APP_KEY || 'my_reverb_key';

    try {
        window.Echo = new Echo({
            broadcaster: 'reverb',
            key: appKey,
            wsHost: wsHost,
            wsPort: wsPort,
            wssPort: wsPort,
            forceTLS: isHttps,
            enabledTransports: ['ws', 'wss'],
        });
    } catch (e) {
        console.warn('Echo initialization skipped or failed:', e);
    }
}
