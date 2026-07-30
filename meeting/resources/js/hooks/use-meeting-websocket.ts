import { useEffect } from 'react';
import { router } from '@inertiajs/react';

export function useMeetingWebSocket(meetingId: number | undefined) {
    useEffect(() => {
        if (!meetingId) return;

        const channelName = `meeting.${meetingId}`;
        const channel = (window as any).Echo?.channel(channelName);
        
        if (channel) {
            channel.listen('MeetingUpdated', (e: any) => {
                console.log(`Meeting ${meetingId} updated:`, e);
                router.reload({ only: ['meeting', 'meetings'] }); // Reload meeting data
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
