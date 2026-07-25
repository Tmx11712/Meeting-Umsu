import { Link, usePage } from '@inertiajs/react';
import { Check } from 'lucide-react';

export function MeetingStepper({ meeting, activeStage }: { meeting: any, activeStage: number }) {
    const steps = [
        { id: 1, name: 'Login', desc: '', route: null }, // Dummy step as per UI
        { id: 2, name: 'Buat Rapat', desc: '', route: 'meetings.show' },
        { id: 3, name: 'Humas Rekam', desc: 'Rekam & Transkripsi', route: 'meetings.recording' },
        { id: 4, name: 'Koreksi Transkrip', desc: 'Koreksi & Finalisasi', route: 'meetings.correction' },
        { id: 5, name: 'Absensi', desc: 'Daftar Kehadiran', route: 'meetings.attendance' },
        { id: 6, name: 'Review', desc: 'Review Notulen', route: 'meetings.review' },
        { id: 7, name: 'Pimpinan', desc: 'Persetujuan', route: 'meetings.approval' },
    ];

    const currentStage = meeting.current_stage || 1;

    const getRoutePath = (routeName: string | null, id: number) => {
        if (!routeName) return '#';
        
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
        <div className="w-full py-4 mb-6 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[800px]">
                {steps.map((step, index) => {
                    const isActive = step.id === activeStage;
                    const isCompleted = step.id < activeStage;
                    const isAccessible = true; 

                    return (
                        <div key={step.id} className="flex items-center relative flex-1">
                            <Link
                                href={isAccessible ? getRoutePath(step.route, meeting.id) : '#'}
                                className={`flex items-center gap-3 ${!isAccessible ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <div className={`
                                    flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold text-sm transition-colors
                                    ${isActive ? 'border-blue-600 bg-blue-600 text-white' : 
                                      isCompleted ? 'border-green-500 bg-transparent text-green-500' : 
                                      'border-slate-200 bg-transparent text-slate-400'}
                                `}>
                                    {isCompleted ? <Check className="w-5 h-5" /> : step.id}
                                </div>
                                <div>
                                    <h4 className={`text-sm font-semibold ${isActive || isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                                        {step.name}
                                    </h4>
                                    {step.desc && (
                                        <p className="text-xs text-slate-500">{step.desc}</p>
                                    )}
                                </div>
                            </Link>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className={`absolute top-1/2 left-[calc(100%-2rem)] w-full h-[1px] -translate-y-1/2 
                                    ${isCompleted ? 'bg-green-500' : 'bg-slate-200'}
                                `} style={{ width: 'calc(100% - 2.5rem)', left: 'auto', right: '-10px', zIndex: -1 }}></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
