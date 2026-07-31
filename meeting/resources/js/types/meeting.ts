export interface User {
    id: number;
    name: string;
    email: string;
}

export interface MeetingRecording {
    id: number;
    meeting_id: number;
    file_path: string;
    file_name: string;
    file_size: number;
    duration: number;
    segments: number;
    status: string;
    transcripts?: any[];
}

export interface MeetingAttendance {
    id: number;
    meeting_id: number;
    user_id: number;
    status: string;
    check_in_time?: string;
    method?: string;
    notes?: string;
    user?: User;
}

export interface MeetingMinute {
    id: number;
    meeting_id: number;
    content: any; // JSON object containing pembukaan, pembahasan, keputusan
    action_items?: any[];
    status: string;
    ai_topics_count?: number;
    ai_decisions_count?: number;
    reviewed_at?: string;
    updated_at?: string;
}

export interface Meeting {
    id: number;
    title: string;
    date: string;
    start_time: string;
    end_time: string;
    location: string;
    status: string;
    current_stage: number;
    participants: { id: number; meeting_id: number; user_id: number; user?: User }[];
    recordings: MeetingRecording[];
    attendances: MeetingAttendance[];
    minutes: MeetingMinute[];
    documents?: any[];
    duration_formatted?: string;
    source?: string;
    creator?: User;
    created_at?: string;
    updated_at?: string;
}
