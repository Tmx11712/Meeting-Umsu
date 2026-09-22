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

/**
 * [EDUKASI ARSITEKTUR: APPROVAL WORKFLOW]
 * Controller ini mengelola alur persetujuan (approval workflow) notulensi rapat oleh Pimpinan.
 *
 * Alur kerja:
 * 1. Notulis selesai menyusun notulen → status menjadi 'menunggu_persetujuan'.
 * 2. Pimpinan membuka halaman ini, membaca notulen, lalu memilih: Setujui atau Tolak.
 * 3. Jika DISETUJUI: status rapat difinalisasi, notulen berstatus 'disetujui', file PDF siap dicetak.
 * 4. Jika DITOLAK: notulen dikembalikan ke Notulis untuk direvisi beserta catatan penolakan.
 *
 * Seluruh aksi di sini dibungkus dengan `DB::transaction()` untuk memastikan konsistensi data.
 */
class MeetingApprovalController extends Controller
{
    public function show(Meeting $meeting)
    {
        $this->authorize('view', $meeting);

        $meeting->load('minutes.actionItems', 'participants.user', 'documents', 'recordings');

        return Inertia::render('meetings/approval', [
            'meeting' => $meeting,
        ]);
    }

    public function store(StoreApprovalRequest $request, Meeting $meeting)
    {
        $minute = $meeting->minutes()->latest()->firstOrFail();

        abort_unless(
            in_array($minute->status, [MeetingMinuteStatus::MENUNGGU_PERSETUJUAN->value, MeetingMinuteStatus::DISETUJUI->value]),
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

            $minute->fill(['status' => $request->decision === 'approved' ? MeetingMinuteStatus::DISETUJUI->value : MeetingMinuteStatus::DITOLAK->value])->save();
            if ($request->decision === 'approved') {
                $meeting->fill([
                    'status' => MeetingStatus::SELESAI->value,
                    'current_stage' => 7,
                ]);
                $meeting->save();
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
