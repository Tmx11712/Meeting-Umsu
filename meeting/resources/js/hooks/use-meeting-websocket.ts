import { useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

export function useMeetingWebSocket(meetingId: number | undefined) {
    const page = usePage<any>();
    const meeting = page.props.meeting;

    // Logic for routing based on stage
    const checkAndRedirect = (stage: number) => {
        if (!meetingId) return;
        const currentPath = window.location.pathname;
        
        if (stage === 3 && !currentPath.includes('/correction')) router.visit(`/meetings/${meetingId}/correction`);
        else if (stage === 4 && !currentPath.includes('/attendance')) router.visit(`/meetings/${meetingId}/attendance`);
        else if (stage === 5 && !currentPath.includes('/review')) router.visit(`/meetings/${meetingId}/review`);
        else if (stage === 6 && !currentPath.includes('/approval')) router.visit(`/meetings/${meetingId}/approval`);
        else if (stage === 7) router.visit('/dashboard');
    };

    // Watch for prop changes (e.g., from fallback polling)
    useEffect(() => {
        if (meeting?.current_stage) {
            checkAndRedirect(meeting.current_stage);
        }
    }, [meeting?.current_stage, meetingId]);

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
                    checkAndRedirect(e.meeting.current_stage);
                    router.reload({ only: ['meeting', 'meetings'] });
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
