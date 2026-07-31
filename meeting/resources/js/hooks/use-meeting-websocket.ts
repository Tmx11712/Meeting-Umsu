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
                
                if (e.meeting && e.meeting.current_stage) {
                    const stage = e.meeting.current_stage;
                    const currentPath = window.location.pathname;
                    
                    // Route mapping based on current stage
                    // When a stage is marked as 'current', it means we should redirect to the page for that stage's NEXT phase
                    if (stage === 3 && !currentPath.includes('/correction')) router.visit(`/meetings/${meetingId}/correction`); // Humas finished -> go to Koreksi (step 4)
                    else if (stage === 4 && !currentPath.includes('/attendance')) router.visit(`/meetings/${meetingId}/attendance`); // Koreksi finished -> go to Absensi (step 5)
                    else if (stage === 5 && !currentPath.includes('/review')) router.visit(`/meetings/${meetingId}/review`); // Absensi finished -> go to Review (step 6)
                    else if (stage === 6 && !currentPath.includes('/approval')) router.visit(`/meetings/${meetingId}/approval`); // Review finished -> go to Pimpinan (step 7)
                    else if (stage === 7) router.visit('/dashboard'); // Pimpinan approved -> go to Dashboard
                    else router.reload({ only: ['meeting', 'meetings'] });
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
