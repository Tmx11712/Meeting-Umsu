import { router, usePage } from '@inertiajs/react';
import { useEffect, useCallback } from 'react';

export function useMeetingWebSocket(meetingId: number | undefined) {
    /**
     * [EDUKASI ARSITEKTUR: WEB SOCKETS & EVENT BROADCASTING]
     * Komponen ini (Custom Hook) bertugas membangun jembatan real-time antara Laravel Backend dan React Frontend.
     * Menggunakan Laravel Reverb/Pusher (Echo), setiap kali Backend menjalankan `safe_broadcast(new MeetingUpdated(...))`,
     * Hook ini akan mendengarnya dalam hitungan milidetik dan secara otomatis memicu Inertia (router.reload())
     * untuk mengambil data terbaru tanpa perlu me-refresh halaman (Seamless SPA experience).
     */
    const { auth } = usePage<any>().props;
    const roles = auth?.roles || [];
    const isAdmin = roles.includes('Super Admin') || roles.includes('Administrator');
    const isUmum = roles.includes('Bag. Umum');
    const isHumas = roles.includes('Bag. Humas');
    const isOperator = isAdmin || isUmum || isHumas;

    // Logic for routing based on stage (only used for realtime advancement, not on mount)
    // Humas tetap di ruang rekaman, hanya Admin & Bag. Umum yang maju ke koreksi/absensi/review.
    // Humas baru diarahkan saat stage 6+ (approval) untuk melihat hasil akhir.
    const isAdminOrUmum = isAdmin || isUmum;

    const checkAndRedirect = useCallback((stage: number): boolean => {
        if (!meetingId) {
            return false;
        }

        const currentPath = window.location.pathname;
        
        // Stage 3-5: Hanya Admin & Bag. Umum yang diarahkan. Humas tetap di ruang rekaman.
        if (stage === 3 && !currentPath.includes('/correction')) {
            if (isAdminOrUmum) {
                router.visit(`/meetings/${meetingId}/correction`);

                return true; 
            }
        } else if (stage === 4 && !currentPath.includes('/attendance')) {
            if (isAdminOrUmum) {
                router.visit(`/meetings/${meetingId}/attendance`);

                return true; 
            }
        } else if (stage === 5 && !currentPath.includes('/review')) {
            if (isAdminOrUmum) {
                router.visit(`/meetings/${meetingId}/review`);

                return true; 
            }
        } else if (stage >= 6 && !currentPath.includes('/approval')) {
            // Stage 6+: Semua role (termasuk Humas) diarahkan ke halaman approval
            router.visit(`/meetings/${meetingId}/approval`);

            return true; 
        }
        
        return false;
    }, [meetingId, isAdminOrUmum]);

    // Removed the aggressive mount-time redirect useEffect so users can click older tabs.


    // Fallback polling in case WebSocket server is dead/blocked
    useEffect(() => {
        if (!meetingId) {
            return;
        }
        
        const safeReload = () => {
            router.reload({
                only: ['meeting', 'meetings'],
                onError: () => {
                    // Meeting sudah dihapus (404), arahkan ke dashboard
                    router.visit('/dashboard', { replace: true });
                },
            });
        };

        const interval = setInterval(safeReload, 30000); // 30 seconds fallback polling
        
        // When tab becomes active again, immediately fetch fresh data
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                safeReload();
            }
        };
        
        window.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleVisibilityChange);
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleVisibilityChange);
        };
    }, [meetingId]);

    useEffect(() => {
        if (!meetingId) {
return;
}

        const channelName = `meeting.${meetingId}`;
        const channel = (window as any).Echo?.channel(channelName);
        
        if (channel) {
            channel.listen('MeetingUpdated', (e: any) => {
                console.log(`Meeting ${meetingId} updated via WS:`, e);
                
                if (e.meeting && e.type === 'stage_changed' && e.meeting.current_stage) {
                    const redirected = checkAndRedirect(e.meeting.current_stage);

                    if (!redirected) {
                        router.reload({ only: ['meeting', 'meetings'] });
                    }
                } else if (e.type === 'approval') {
                    // Pimpinan sudah approve → arahkan semua ke dashboard
                    router.visit('/dashboard');
                } else if (e.type === 'deleted') {
                    router.visit('/dashboard', { replace: true });
                } else {
                    router.reload({ only: ['meeting', 'meetings'] });
                }
            });
        }

        return () => {
            if (channel) {
                channel.stopListening('MeetingUpdated');
                (window as any).Echo?.leaveChannel(channelName);
            }
        };
    }, [meetingId, checkAndRedirect]);
}
