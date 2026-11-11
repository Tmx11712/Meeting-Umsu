import { Link } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { Fragment } from 'react';

import { usePermissions } from '@/hooks/use-permissions';

export function MeetingStepper({
    meeting,
    activeStage,
}: {
    meeting: any;
    activeStage: number;
}) {
    const { hasRole } = usePermissions();
    const isLeaderOrViewer = hasRole('Pimpinan') || hasRole('Viewer');

    let steps = [
        { id: 1, name: 'Login', desc: '', route: null }, // Dummy step as per UI
        { id: 2, name: 'Buat Rapat', desc: '', route: 'meetings.show' },
        { id: 3, name: 'Humas Rekam', desc: '', route: 'meetings.recording' },
        {
            id: 4,
            name: 'Koreksi Transkrip',
            desc: '',
            route: 'meetings.correction',
        },
        { id: 5, name: 'Review', desc: '', route: 'meetings.review' },
        { id: 6, name: 'Pimpinan', desc: '', route: 'meetings.approval' },
    ];

    if (isLeaderOrViewer) {
        steps = steps.filter(
            (step) =>
                !['Koreksi Transkrip', 'Humas Rekam', 'Review'].includes(
                    step.name,
                ),
        );
    }

    const currentStage = meeting.current_stage || 1;

    const getRoutePath = (routeName: string | null, id: number) => {
        if (!routeName) {
            return '#';
        }

        switch (routeName) {
            case 'meetings.show':
                return `/meetings/${id}`;
            case 'meetings.recording':
                return `/meetings/${id}/recording`;
            case 'meetings.correction':
                return `/meetings/${id}/correction`;
            case 'meetings.review':
                return `/meetings/${id}/review`;
            case 'meetings.approval':
                return `/meetings/${id}/approval`;
            default:
                return '#';
        }
    };

    return (
        <div className="w-full scrollbar-none overflow-x-auto [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-200 items-center justify-between">
                {steps.map((step, index) => {
                    const isActive = step.id === activeStage;
                    const isCompleted = step.id < activeStage;
                    const isAccessible = true;

                    return (
                        <Fragment key={step.id}>
                            <Link
                                href={
                                    isAccessible
                                        ? getRoutePath(step.route, meeting.id)
                                        : '#'
                                }
                                className={`flex shrink-0 items-center gap-3 ${!isAccessible ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            >
                                <div
                                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                                        isActive
                                            ? 'border-blue-600 bg-blue-600 text-white'
                                            : isCompleted
                                              ? 'border-green-500 bg-white text-green-500 dark:bg-slate-900'
                                              : 'border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900'
                                    } `}
                                >
                                    {isCompleted ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        step.id
                                    )}
                                </div>
                                <div>
                                    <h4
                                        className={`text-sm font-semibold ${isActive || isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}
                                    >
                                        {step.name}
                                    </h4>
                                    {step.desc && (
                                        <p className="text-xs whitespace-nowrap text-slate-500">
                                            {step.desc}
                                        </p>
                                    )}
                                </div>
                            </Link>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`mx-4 h-0.5 min-w-5 flex-1 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'} `}
                                ></div>
                            )}
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
}
