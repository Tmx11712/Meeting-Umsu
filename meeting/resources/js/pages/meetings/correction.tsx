import { Head, useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MeetingTabs } from '@/components/meeting-tabs';
import { useState } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

export default function MeetingCorrection({ meeting }: any) {
    const { canEdit } = usePermissions();
    const canCorrect = canEdit('transcript');
    const transcripts = meeting.transcripts || [];
    
    // Sort transcripts just in case
    transcripts.sort((a: any, b: any) => a.sequence_order - b.sequence_order);

    const handleCorrection = (transcriptId: string, originalText: string, correctedText: string) => {
        if (originalText === correctedText) return;
        
        router.post(`/meetings/${meeting.id}/correction`, {
            transcript_id: transcriptId,
            original_text: originalText,
            corrected_text: correctedText
        }, { preserveScroll: true, preserveState: true });
    };

    const handleFinish = () => {
        router.post(`/meetings/${meeting.id}/correction/finish`);
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 max-w-6xl mx-auto w-full">
            <Head title="Koreksi Transkrip" />
            
            <div className="mb-2">
                <h1 className="text-2xl font-bold tracking-tight">{meeting.title}</h1>
            </div>

            <MeetingTabs meeting={meeting} activeTab="correction" />

            {!canCorrect && (
                <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800 font-semibold">Mode Hanya Baca</AlertTitle>
                    <AlertDescription className="text-red-700">
                        Anda tidak memiliki izin untuk mengoreksi notulen ini. Anda hanya dapat melihat data.
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Editor Transkrip</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                    {transcripts.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            Belum ada transkrip untuk dikoreksi. Pastikan audio sudah direkam atau diupload.
                        </div>
                    ) : (
                        transcripts.map((t: any) => {
                            const latestCorrection = t.corrections?.length > 0 ? t.corrections[t.corrections.length - 1] : null;
                            const text = latestCorrection ? latestCorrection.corrected_text : t.text;
                            
                            return (
                                <TranscriptItem 
                                    key={t.id} 
                                    transcript={t} 
                                    initialText={text} 
                                    canCorrect={canCorrect}
                                    onSave={(newText: string) => handleCorrection(t.id, text, newText)} 
                                />
                            );
                        })
                    )}
                </CardContent>
                <CardFooter className="flex justify-end pt-6 border-t">
                    <Button onClick={handleFinish} disabled={transcripts.length === 0 || !canCorrect}>
                        Selesai & Lanjut ke Absensi
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

function TranscriptItem({ transcript, initialText, onSave, canCorrect }: any) {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(initialText);

    const handleSave = () => {
        onSave(text);
        setIsEditing(false);
    };

    return (
        <div className="flex gap-4 p-4 border rounded-md group hover:bg-muted/10 transition-colors">
            <div className="w-16 flex-shrink-0 text-sm font-medium text-muted-foreground pt-1">
                {Math.floor(transcript.timestamp_seconds / 60)}:{(transcript.timestamp_seconds % 60).toString().padStart(2, '0')}
            </div>
            <div className="flex-1">
                {isEditing ? (
                    <div className="space-y-2">
                        <textarea 
                            className="w-full bg-background rounded-md border border-input p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            rows={3}
                            value={text}
                            onChange={e => setText(e.target.value)}
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => { setText(initialText); setIsEditing(false); }}>Batal</Button>
                            <Button size="sm" onClick={handleSave}>Simpan</Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
                )}
            </div>
            {!isEditing && canCorrect && (
                <div className="flex-shrink-0 pt-1">
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => setIsEditing(true)}
                    >
                        Koreksi
                    </Button>
                </div>
            )}
        </div>
    );
}
