<?php

namespace App\Http\Controllers;

use App\Actions\IrvanCloud\SyncMeetingsAction;
use App\Events\MeetingsListUpdated;
use App\Events\MeetingUpdated;
use App\Http\Requests\Meeting\StoreMeetingRequest;
use App\Http\Requests\Meeting\UpdateMeetingRequest;
use App\Models\Meeting;
use App\Models\MeetingParticipant;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MeetingController extends Controller
{
    public function index(Request $request)
    {
        /**
         * [EDUKASI ARSITEKTUR: MENCEGAH N+1 QUERY]
         * Kita menggunakan `withCount('participants')` alih-alih `with('participants')`.
         * Alih-alih merender seluruh baris data peserta ke dalam memori PHP (yang bisa bikin RAM overload),
         * kita memerintahkan database (SQL) untuk hanya menghitung angkanya saja (`SELECT COUNT()`).
         * Jauh lebih ringan dan cepat!
         */
        $query = Meeting::query()->withCount('participants');

        if ($request->search) {
            $query->where('title', 'ilike', '%'.$request->search.'%');
        }
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $meetings = $query->orderBy('date', 'desc')->paginate(10);

        return Inertia::render('meetings/index', [
            'meetings' => $meetings,
            'filters' => $request->only(['search', 'status', 'month']),
        ]);
    }

    public function create()
    {
        $users = User::where('status', 'aktif')->get(['id', 'name', 'department', 'initials']);

        return Inertia::render('meetings/create', [
            'users' => $users,
        ]);
    }

    public function store(StoreMeetingRequest $request)
    {
        $validated = $request->validated();

        $start = Carbon::parse($validated['start_time']);
        $end = Carbon::parse($validated['end_time']);
        $validated['duration'] = $end->diffInSeconds($start);

        $validated['created_by'] = auth()->id();
        $validated['status'] = 'terjadwal';
        $validated['current_stage'] = 1;
        $validated['source'] = 'manual';

        if (! empty($validated['agenda'])) {
            // Encode agenda array to JSON for storing in notes
            $validated['notes'] = json_encode(['agenda' => $validated['agenda']]);
        }

        $meeting = Meeting::create($validated);

        if (! empty($validated['participants'])) {
            $participants = [];
            foreach ($validated['participants'] as $userId) {
                $participants[] = [
                    'id' => Str::uuid()->toString(),
                    'meeting_id' => $meeting->id,
                    'user_id' => $userId,
                    'is_invited' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            MeetingParticipant::insert($participants);
        }

        safe_broadcast(new MeetingsListUpdated('Rapat baru "'.$meeting->title.'" telah dijadwalkan'));

        return redirect()->route('meetings.index')->with('success', 'Rapat berhasil dibuat dan dijadwalkan.');
    }

    public function syncFromIrvanCloud(Request $request, SyncMeetingsAction $syncAction)
    {
        $date = $request->query('date');
        // By default, it will sync current month's events
        $result = $syncAction->execute();

        if ($result['success']) {
            return redirect()->route('meetings.index')->with('success', $result['message']);
        } else {
            return redirect()->route('meetings.index')->with('error', $result['message']);
        }
    }

    public function autoSync(SyncMeetingsAction $syncAction)
    {
        // Gunakan cache lock selama 5 menit agar tidak membebani server (spam)
        $lock = Cache::lock('irvan_cloud_auto_sync', 300);

        if ($lock->get()) {
            $syncAction->execute();

            return response()->json(['status' => 'synced']);
        }

        return response()->json(['status' => 'skipped_throttled']);
    }

    public function show(Meeting $meeting)
    {
        $meeting->load('participants.user', 'recordings', 'minutes', 'attendances');

        // Jika rapat sudah selesai (stage >= 7), arahkan semua user langsung ke halaman hasil (approval)
        if ($meeting->current_stage >= 7) {
            return redirect()->route('meetings.approval', $meeting->id);
        }

        // redirect to the current stage page
        // 1=Buat Rapat, 2=Humas Rekam, 3=Koreksi, 4=Absensi, 5=Review, 6=Pimpinan
        // For simplicity, we just render a view or redirect based on stage
        return Inertia::render('meetings/show', [
            'meeting' => $meeting,
        ]);
    }

    public function edit(Meeting $meeting)
    {
        $meeting->load('participants');
        $users = User::where('status', 'aktif')->get(['id', 'name', 'department', 'initials']);

        return Inertia::render('meetings/create', [
            'meeting' => $meeting,
            'users' => $users,
        ]);
    }

    public function update(UpdateMeetingRequest $request, Meeting $meeting)
    {
        $validated = $request->validated();

        $start = Carbon::parse($validated['start_time']);
        $end = Carbon::parse($validated['end_time']);
        $validated['duration'] = $end->diffInSeconds($start);

        if (isset($validated['agenda'])) {
            $validated['notes'] = json_encode(['agenda' => $validated['agenda']]);
        }

        $meeting->update($validated);

        $existingIds = $meeting->participants()->pluck('user_id')->toArray();
        $newIds = $validated['participants'] ?? [];

        $toDelete = array_diff($existingIds, $newIds);
        $toAdd = array_diff($newIds, $existingIds);

        if (! empty($toDelete)) {
            $meeting->participants()->whereIn('user_id', $toDelete)->delete();
        }

        foreach ($toAdd as $userId) {
            $meeting->participants()->create([
                'user_id' => $userId,
                'is_invited' => true,
            ]);
        }

        safe_broadcast(new MeetingsListUpdated('Rapat '.$meeting->title.' telah diperbarui'));

        return redirect()->route('meetings.show', $meeting->id)->with('success', 'Rapat berhasil diperbarui.');
    }

    public function destroy(Meeting $meeting)
    {
        abort_unless(auth()->user()->can('meeting.delete'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk menghapus rapat.');

        safe_broadcast(new MeetingUpdated($meeting, 'deleted'));

        $meeting->forceDelete();

        safe_broadcast(new MeetingsListUpdated('Rapat telah dihapus'));

        return redirect()->back()->with('success', 'Rapat berhasil dihapus permanen.');
    }
}
