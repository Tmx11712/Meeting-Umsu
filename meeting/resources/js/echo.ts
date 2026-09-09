import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

if (typeof window !== 'undefined') {
    window.Pusher = Pusher;

    const isHttps = window.location.protocol === 'https:' || import.meta.env.VITE_REVERB_SCHEME === 'https';

    const envHost = import.meta.env.VITE_REVERB_HOST;
    // Dynamically connect to the host the user is browsing on,
    // ensuring WebSockets work seamlessly on localhost, LAN IP (192.168.x.x), Tailscale (100.x.x.x), and domain names.
    const wsHost = (envHost && envHost !== 'localhost' && envHost !== '127.0.0.1')
        ? envHost
        : window.location.hostname;

    // In production behind Nginx reverse proxy, port 80/443 forwards /app to Reverb 8080.
    // In local development (port 8000/5173), connect directly to Reverb port (default 8080).
    const isLocalDev = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        && window.location.port !== '' && window.location.port !== '80' && window.location.port !== '443';

    const wsPort = isLocalDev
        ? Number(import.meta.env.VITE_REVERB_PORT ?? 8080)
        : (window.location.port ? Number(window.location.port) : (isHttps ? 443 : 80));

    const appKey = import.meta.env.VITE_REVERB_APP_KEY || 'my_reverb_key';

    // Log WebSocket events in console so operators/developers can see connection status
    (Pusher as any).logToConsole = true;

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

        window.Echo.connector?.pusher?.connection?.bind('connected', () => {
            console.log('[Echo Reverb] Connected successfully to WebSocket server.');
        });
        window.Echo.connector?.pusher?.connection?.bind('error', (err: any) => {
            console.warn('[Echo Reverb] Connection error:', err);
        });
    } catch (e) {
        console.warn('Echo initialization skipped or failed:', e);
    }
}
