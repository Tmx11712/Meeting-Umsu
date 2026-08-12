import { useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

export function useMeetingWebSocket(meetingId: number | undefined) {
    const page = usePage<any>();
    const meeting = page.props.meeting;

    // Logic for routing based on stage (only used for realtime advancement, not on mount)
    const checkAndRedirect = (stage: number): boolean => {
        if (!meetingId) return false;
        const currentPath = window.location.pathname;
        
        // We no longer aggressively redirect on mount, so users can navigate freely.
        // The redirects below are only triggered by realtime WS events to pull users forward.
        if (stage === 3 && !currentPath.includes('/correction')) { router.visit(`/meetings/${meetingId}/correction`); return true; }
        else if (stage === 4 && !currentPath.includes('/attendance')) { router.visit(`/meetings/${meetingId}/attendance`); return true; }
        else if (stage === 5 && !currentPath.includes('/review')) { router.visit(`/meetings/${meetingId}/review`); return true; }
        else if (stage === 6 && !currentPath.includes('/approval')) { router.visit(`/meetings/${meetingId}/approval`); return true; }
        
        return false;
    };

    // Removed the aggressive mount-time redirect useEffect so users can click older tabs.


    // Fallback polling in case WebSocket server is dead/blocked
    useEffect(() => {
        if (!meetingId) return;
        
        const interval = setInterval(() => {
            router.reload({ only: ['meeting', 'meetings'] });
        }, 5000); // 5 seconds polling
        
        return () => clearInterval(interval);
    }, [meetingId]);

    useEffect(() => {
        if (!meetingId) return;

        const channelName = `meeting.${meetingId}`;
        const channel = (window as any).Echo?.channel(channelName);
        
        if (channel) {
            channel.listen('MeetingUpdated', (e: any) => {
                console.log(`Meeting ${meetingId} updated via WS:`, e);
                
                if (e.meeting && e.meeting.current_stage) {
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
    }, [meetingId]);
}
