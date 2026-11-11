<?php

namespace App\Http\Controllers;

use App\Actions\IrvanCloud\SyncMeetingsAction;
use App\Enums\MeetingStatus;
use App\Events\MeetingsListUpdated;
use App\Events\MeetingUpdated;
use App\Http\Requests\Meeting\StoreMeetingRequest;
use App\Http\Requests\Meeting\UpdateMeetingRequest;
use App\Models\Meeting;
use App\Models\MeetingActionItem;
use App\Models\MeetingRoom;
use App\Models\MeetingType;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MeetingController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Meeting::class);

        /**
         * [EDUKASI ARSITEKTUR: MENCEGAH N+1 QUERY]
         * Kita menggunakan `withCount('participants')` alih-alih `with('participants')`.
         * Alih-alih merender seluruh baris data peserta ke dalam memori PHP (yang bisa bikin RAM overload),
         * kita memerintahkan database (SQL) untuk hanya menghitung angkanya saja (`SELECT COUNT()`).
         * Jauh lebih ringan dan cepat!
         */
        $meetings = Meeting::query()
            ->visibleTo($request->user())
            ->withCount('participants')
            ->with(['minutes' => function ($q) {
                $q->select('id', 'meeting_id', 'content');
            }])
            ->filter($request->only(['search', 'status', 'month']))
            ->orderBy('date', 'desc')
            ->paginate(10)
            ->through(fn (Meeting $meeting) => $meeting->resolveParticipantsCount());

        return Inertia::render('meetings/index', [
            'meetings' => $meetings,
            'filters' => $request->only(['search', 'status', 'month']),
        ]);
    }

    /**
     * [EDUKASI ARSITEKTUR: MVC & INERTIA.JS]
     * Method `create()` ini adalah bagian dari Controller. Tugasnya adalah mengambil data yang diperlukan dari database (Model),
     * memprosesnya, lalu mengirimkannya ke tampilan (View) menggunakan Inertia::render().
     * Ini membuat aplikasi kita terasa seperti Single Page Application (SPA) tanpa perlu menulis API khusus.
     */
    public function create()
    {
        $this->authorize('create', Meeting::class);

        $users = User::query()->where('status', '=', 'aktif')->get(['id', 'name', 'department', 'initials']);

        $now = Carbon::now();

        $upcomingMeetings = Meeting::withCount('participants')
            ->with(['minutes' => function ($q) {
                $q->select('id', 'meeting_id', 'content');
            }])
            ->where('date', '>=', $now->toDateString())
            ->whereIn('current_stage', [1, 2], 'and', false)
            ->orderBy('date', 'asc')
            ->orderBy('start_time', 'asc')
            ->take(3)
            ->get()
            ->map(fn (Meeting $meeting) => $meeting->resolveParticipantsCount());

        $actionItems = MeetingActionItem::with(['meeting'])
            ->where('status', '=', 'open')
            ->orderBy('deadline', 'asc')
            ->take(3)
            ->get();
        $meetingTypes = Cache::remember('active_meeting_types', 3600, fn () => MeetingType::where('is_active', true)->orderBy('name')->pluck('name'));
        $meetingRooms = Cache::remember('active_meeting_rooms', 3600, fn () => MeetingRoom::where('is_active', true)->orderBy('name')->pluck('name'));

        return Inertia::render('meetings/create', [
            'users' => $users,
            'upcomingMeetings' => $upcomingMeetings,
            'actionItems' => $actionItems,
            'meetingTypes' => $meetingTypes,
            'meetingRooms' => $meetingRooms,
        ]);
    }

    public function store(StoreMeetingRequest $request)
    {
        /**
         * [EDUKASI ARSITEKTUR: FORM REQUEST VALIDATION]
         * Daripada melakukan validasi yang panjang di dalam Controller (seperti $request->validate([...])),
         * Laravel menggunakan "Form Request" (StoreMeetingRequest) untuk memisahkan logika validasi.
         * Jika input tidak valid, Laravel akan otomatis menghentikan eksekusi dan mengembalikan pesan error.
         * Dengan memanggil `validated()`, kita mendapatkan array data yang sudah pasti aman.
         */
        $validated = $request->validated();

        $meetingAttributes = $request->safe()->except(['participants', 'auto_record']);
        $meetingAttributes['type'] = $meetingAttributes['type'] ?: 'Rapat internal';
        $meetingAttributes['location'] = $meetingAttributes['location'] ?: 'Belum ditentukan';
        $meetingAttributes['duration'] = Meeting::calculateDurationSeconds($validated['start_time'], $validated['end_time']);
        $meetingAttributes['created_by'] = $request->user()->id;
        $meetingAttributes['status'] = 'terjadwal';
        $meetingAttributes['current_stage'] = 1;
        $meetingAttributes['source'] = 'manual';

        $meeting = Meeting::create($meetingAttributes);

        if (! empty($validated['participants'])) {
            $participants = [];
            foreach ($validated['participants'] as $userId) {
                $participants[] = [
                    'id' => Str::uuid()->toString(),
                    'meeting_id' => $meeting->id,
                    'user_id' => $userId,
                    'is_invited' => true,
                    'created_at' => now()->toDateTimeString(),
                    'updated_at' => now()->toDateTimeString(),
                ];
            }
            DB::table('meeting_participants')->insert($participants);
        }

        safe_broadcast(new MeetingsListUpdated('Rapat baru "'.$meeting->title.'" telah dijadwalkan'));

        return redirect()->route('dashboard')->with('success', 'Rapat berhasil dibuat dan dijadwalkan.');
    }

    public function autoSync(SyncMeetingsAction $syncAction)
    {
        $this->authorize('create', Meeting::class);

        // Gunakan cache lock singkat (20 detik) agar auto-sync responsif namun tetap mencegah spam paralel
        $lock = Cache::lock('irvan_cloud_auto_sync', 20);

        if ($lock->get()) {
            try {
                $result = $syncAction->execute();

                return response()->json([
                    'status' => 'synced',
                    'message' => $result['message'] ?? 'OK',
                ]);
            } finally {
                $lock->release();
            }
        }

        return response()->json(['status' => 'skipped_throttled']);
    }

    public function show(Meeting $meeting)
    {
        $this->authorize('view', $meeting);

        $meeting->load('participants.user', 'recordings', 'minutes', 'attendances');

        // Jika rapat sudah menunggu persetujuan (stage >= 6), arahkan semua user langsung ke halaman hasil (approval)
        if ($meeting->current_stage >= 6) {
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
        $this->authorize('update', $meeting);

        $meeting->load('participants');
        $users = User::query()->where('status', '=', 'aktif')->get(['id', 'name', 'department', 'initials']);

        $meetingTypes = Cache::remember('active_meeting_types', 3600, fn () => MeetingType::where('is_active', true)->orderBy('name')->pluck('name'));
        $meetingRooms = Cache::remember('active_meeting_rooms', 3600, fn () => MeetingRoom::where('is_active', true)->orderBy('name')->pluck('name'));

        return Inertia::render('meetings/create', [
            'meeting' => $meeting,
            'users' => $users,
            'meetingTypes' => $meetingTypes,
            'meetingRooms' => $meetingRooms,
        ]);
    }

    public function update(UpdateMeetingRequest $request, Meeting $meeting)
    {
        $meeting->ensureMutableForEdits();

        $validated = $request->validated();

        $meetingAttributes = $request->safe()->except(['participants']);
        $meetingAttributes['duration'] = Meeting::calculateDurationSeconds($validated['start_time'], $validated['end_time']);

        $meeting->fill($meetingAttributes);
        $meeting->save();

        $existingIds = $meeting->participants()->pluck('user_id')->toArray();
        $newIds = $validated['participants'] ?? [];

        $toDelete = array_diff($existingIds, $newIds);
        $toAdd = array_diff($newIds, $existingIds);

        if (! empty($toDelete)) {
            $meeting->participants()->whereIn('user_id', $toDelete, 'and', false)->delete();
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

    public function cancel(Meeting $meeting)
    {
        $this->authorize('update', $meeting);
        abort_if($meeting->status === MeetingStatus::SELESAI->value, 422, 'Rapat yang sudah selesai tidak dapat dibatalkan.');

        $meeting->status = 'dibatalkan';
        $meeting->save();

        safe_broadcast(new MeetingUpdated($meeting, 'cancelled'));
        safe_broadcast(new MeetingsListUpdated('Rapat '.$meeting->title.' telah dibatalkan'));

        return redirect()->route('dashboard')->with('success', 'Rapat berhasil dibatalkan.');
    }

    public function destroy(Meeting $meeting)
    {
        $this->authorize('delete', $meeting);

        $meetingId = $meeting->id;
        $meetingTitleSlug = Str::slug($meeting->title) ?: 'rapat';

        // Meeting::deleting sudah menghapus relasi, rekaman, dokumen, dan folder utama di storage
        Meeting::destroy($meeting->id);

        safe_broadcast(new MeetingUpdated($meeting, 'deleted'), false);
        safe_broadcast(new MeetingsListUpdated('Rapat telah dihapus'), false);

        app()->terminating(function () use ($meetingId, $meetingTitleSlug) {
            try {
                $folderName = $meetingId.'-'.$meetingTitleSlug;
                Storage::deleteDirectory('recordings/'.$meetingId);
                Storage::deleteDirectory('documents/'.$meetingId);
                Storage::deleteDirectory('documents/'.$folderName);
            } catch (\Throwable $e) {
                Log::warning('Gagal menghapus direktori sisa rapat: '.$e->getMessage());
            }
        });

        return redirect()->back()->with('success', 'Rapat berhasil dihapus beserta file rekamannya.');
    }
}
