import { Link } from '@inertiajs/react';
import { Info, Mic, Edit3, UserCheck, FileText, CheckCircle } from 'lucide-react';

export function MeetingTabs({ meeting, activeTab }: { meeting: any, activeTab: string }) {
    const tabs = [
        { id: 'info', name: 'Info Umum', route: 'meetings.show', icon: Info, stage: 1 },
        { id: 'recording', name: 'Humas Rekam', route: 'meetings.recording', icon: Mic, stage: 2 },
        { id: 'correction', name: 'Koreksi Transkrip', route: 'meetings.correction', icon: Edit3, stage: 3 },
        { id: 'attendance', name: 'Absensi', route: 'meetings.attendance', icon: UserCheck, stage: 4 },
        { id: 'review', name: 'Review Notulen', route: 'meetings.review', icon: FileText, stage: 5 },
        { id: 'approval', name: 'Approval Pimpinan', route: 'meetings.approval', icon: CheckCircle, stage: 6 },
    ];

    const currentStage = meeting.current_stage || 1;

    const getRoutePath = (routeName: string, id: number) => {
        switch (routeName) {
            case 'meetings.show': return `/meetings/${id}`;
            case 'meetings.recording': return `/meetings/${id}/recording`;
            case 'meetings.correction': return `/meetings/${id}/correction`;
            case 'meetings.attendance': return `/meetings/${id}/attendance`;
            case 'meetings.review': return `/meetings/${id}/review`;
            case 'meetings.approval': return `/meetings/${id}/approval`;
            default: return '#';
        }
    };

    return (
        <div className="border-b border-border mb-6 overflow-x-auto">
            <nav className="flex space-x-1" aria-label="Tabs">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;

                    return (
                        <Link
                            key={tab.id}
                            href={getRoutePath(tab.route, meeting.id)}
                            className={`
                                ${isActive ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}
                                cursor-pointer
                                flex items-center whitespace-nowrap border-b-2 py-4 px-4 text-sm font-medium transition-colors
                            `}
                        >
                            <tab.icon className={`mr-2 h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                            {tab.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
