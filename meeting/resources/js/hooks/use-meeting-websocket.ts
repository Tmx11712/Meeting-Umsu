import { router, usePage } from '@inertiajs/react';
import { useEffect, useCallback } from 'react';

export function useMeetingWebSocket(meetingId: number | undefined) {
    const { auth } = usePage<any>().props;
    const roles = auth?.roles || [];
    const isAdmin = roles.includes('Super Admin') || roles.includes('Administrator');
    const isUmum = roles.includes('Bag. Umum');
    const isHumas = roles.includes('Bag. Humas');
    const isOperator = isAdmin || isUmum || isHumas;

    // Logic for routing based on stage (only used for realtime advancement, not on mount)
    const checkAndRedirect = useCallback((stage: number): boolean => {
        if (!meetingId) {
            return false;
        }

        const currentPath = window.location.pathname;
        
        // We no longer aggressively redirect on mount, so users can navigate freely.
        // The redirects below are only triggered by realtime WS events to pull users forward.
        if (stage === 3 && !currentPath.includes('/correction')) {
            if (isOperator) {
                router.visit(`/meetings/${meetingId}/correction`);
                return true; 
            }
        } else if (stage === 4 && !currentPath.includes('/attendance')) {
            if (isOperator) {
                router.visit(`/meetings/${meetingId}/attendance`);
                return true; 
            }
        } else if (stage === 5 && !currentPath.includes('/review')) {
            if (isOperator) {
                router.visit(`/meetings/${meetingId}/review`);
                return true; 
            }
        } else if (stage === 6 && !currentPath.includes('/approval')) {
            router.visit(`/meetings/${meetingId}/approval`);

            return true; 
        } else if (stage >= 7 && !currentPath.includes(`/meetings/${meetingId}/approval`)) {
            // Jika rapat sudah selesai (tahap 7), arahkan semua partisipan ke halaman Approval
            router.visit(`/meetings/${meetingId}/approval`);

            return true;
        }
        
        return false;
    }, [meetingId]);

    // Removed the aggressive mount-time redirect useEffect so users can click older tabs.


    // Fallback polling in case WebSocket server is dead/blocked
    useEffect(() => {
        if (!meetingId) {
            return;
        }
        
        const interval = setInterval(() => {
            router.reload({ only: ['meeting', 'meetings'] });
        }, 5000); // 5 seconds polling
        
        // When tab becomes active again, immediately fetch fresh data
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                router.reload({ only: ['meeting', 'meetings'] });
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
