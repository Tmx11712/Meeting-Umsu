<?php

namespace App\Http\Controllers;

use App\Http\Requests\Meeting\StoreApprovalRequest;
use App\Models\Meeting;
use App\Models\MeetingApproval;
use App\Events\MeetingUpdated;
use App\Services\MeetingActionItemService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeetingApprovalController extends Controller
{
    public function show(Meeting $meeting)
    {
        $meeting->load('minutes.actionItems', 'participants.user', 'documents');

        return Inertia::render('meetings/approval', [
            'meeting' => $meeting,
        ]);
    }

    public function store(StoreApprovalRequest $request, Meeting $meeting)
    {
        $minute = $meeting->minutes()->latest()->firstOrFail();

        MeetingApproval::create([
            'meeting_id' => $meeting->id,
            'minute_id' => $minute->id,
            'approved_by' => $request->user()->id,
            'decision' => $request->decision,
            'notes' => $request->notes,
            'decided_at' => now(),
        ]);

        $minute->update(['status' => $request->decision === 'approved' ? 'disetujui' : 'ditolak']);
        if ($request->decision === 'approved') {
            $meeting->update([
                'status' => 'selesai',
                'current_stage' => 7,
            ]);
        }

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
