import { router, usePage } from '@inertiajs/react';
import { useEffect, useCallback } from 'react';

export function useMeetingWebSocket(meetingId: string | number | undefined) {
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
    const isPimpinan = roles.includes('Pimpinan');
    const isOperator = isAdmin || isUmum || isHumas;

    const isAdminOrUmum = isAdmin || isUmum;

    const checkAndRedirect = useCallback((stage: number): boolean => {
        if (!meetingId) {
            return false;
        }

        const currentPath = window.location.pathname;
        
        // Stage 3-5: Hanya Admin & Bag. Umum yang diarahkan (workflow operasional internal).
        // Bag. Humas TETAP di halaman saat ini (biasanya ruang rekaman) dan tidak ditarik ke dapur notulen.
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
            // Stage 6+: Redirect spesifik berdasarkan role
            if (isPimpinan || isAdmin) {
                // Pimpinan (dan Admin) diarahkan ke halaman Approval
                router.visit(`/meetings/${meetingId}/approval`);
                return true; 
            } else if (isHumas || isUmum) {
                // Humas dan Umum diarahkan ke halaman Detail Rapat utama
                // (karena mereka tidak punya wewenang di halaman Approval internal pimpinan)
                if (!currentPath.endsWith(`/meetings/${meetingId}`)) {
                    router.visit(`/meetings/${meetingId}`);
                    return true;
                }
            }
        }
        
        return false;
    }, [meetingId, isAdminOrUmum, isPimpinan, isAdmin, isHumas, isUmum]);

    const safeReload = useCallback(() => {
        router.reload({
            only: ['meeting'],
            onError: () => {
                // Meeting sudah dihapus (404), arahkan ke dashboard
                router.visit('/dashboard', { replace: true });
            },
        });
    }, []);

    // Fallback polling: 5 detik saat di ruang rekaman agar sangat responsif antar-tab
    useEffect(() => {
        if (!meetingId) {
            return;
        }

        const isRecordingPage = window.location.pathname.includes('/recording');
        const pollInterval = isRecordingPage ? 5000 : 15000;

        const interval = setInterval(safeReload, pollInterval);
        
        // Saat tab browser kembali aktif/fokus, langsung ambil data terbaru
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
    }, [meetingId, safeReload]);

    // WebSocket Listeners (Echo)
    useEffect(() => {
        if (!meetingId) {
            return;
        }

        const channelName = `meeting.${meetingId}`;
        const echo = (window as any).Echo;

        if (!echo) {
            return;
        }

        const meetingChannel = echo.channel(channelName);
        const handleMeetingUpdate = (e: any) => {
            console.log(`[WS] Meeting ${meetingId} updated:`, e);
            
            if (e.type === 'deleted') {
                // Rapat telah dihapus, arahkan langsung ke dashboard tanpa safeReload
                router.visit('/dashboard', { replace: true });
                return;
            }

            if (e.meeting && e.type === 'stage_changed' && e.meeting.current_stage) {
                const redirected = checkAndRedirect(e.meeting.current_stage);

                if (!redirected) {
                    safeReload();
                }
            } else if (e.type === 'approval') {
                router.visit('/dashboard');
            } else {
                safeReload();
            }
        };

        meetingChannel.listen('MeetingUpdated', handleMeetingUpdate);
        meetingChannel.listen('.MeetingUpdated', handleMeetingUpdate);

        return () => {
            meetingChannel.stopListening('MeetingUpdated');
            meetingChannel.stopListening('.MeetingUpdated');
            echo.leaveChannel(channelName);
        };
    }, [meetingId, checkAndRedirect, safeReload]);
}
