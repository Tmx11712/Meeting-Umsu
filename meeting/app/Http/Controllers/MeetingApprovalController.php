<?php

namespace App\Http\Controllers;

use App\Enums\MeetingMinuteStatus;
use App\Enums\MeetingStatus;
use App\Events\MeetingUpdated;
use App\Http\Requests\Meeting\StoreApprovalRequest;
use App\Models\Meeting;
use App\Models\MeetingApproval;
use App\Services\MeetingActionItemService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MeetingApprovalController extends Controller
{
    public function show(Meeting $meeting)
    {
        $meeting->load('minutes.actionItems', 'participants.user', 'documents', 'recordings');

        return Inertia::render('meetings/approval', [
            'meeting' => $meeting,
        ]);
    }

    public function store(StoreApprovalRequest $request, Meeting $meeting)
    {
        $minute = $meeting->minutes()->latest()->firstOrFail();

        abort_unless(
            $minute->status === MeetingMinuteStatus::MENUNGGU_PERSETUJUAN->value,
            403,
            'Notulen belum siap untuk disetujui. Status saat ini: '.$minute->status
        );

        DB::transaction(function () use ($request, $meeting, $minute) {
            MeetingApproval::create([
                'meeting_id' => $meeting->id,
                'minute_id' => $minute->id,
                'approved_by' => $request->user()->id,
                'decision' => $request->decision,
                'notes' => $request->notes,
                'decided_at' => now(),
            ]);

            $minute->update(['status' => $request->decision === 'approved' ? MeetingMinuteStatus::DISETUJUI->value : MeetingMinuteStatus::DITOLAK->value]);
            if ($request->decision === 'approved') {
                $meeting->update([
                    'status' => MeetingStatus::SELESAI->value,
                    'current_stage' => 7,
                ]);
            }
        });

        safe_broadcast(new MeetingUpdated($meeting, 'approval'));

        return redirect()->route('dashboard')->with('success', 'Keputusan notulen berhasil disimpan.');
    }

    public function updateActionItems(Request $request, Meeting $meeting, MeetingActionItemService $actionItemService)
    {
        $request->validate([
            'action_items' => 'array',
            'action_items.*.description' => 'required|string',
            'action_items.*.pic' => 'nullable|string',
            'action_items.*.deadline' => 'nullable|date',
        ]);

        $actionItemService->updateForMeeting($meeting, $request->action_items ?? []);

        return back()->with('success', 'Tindak lanjut berhasil diperbarui.');
    }
}
