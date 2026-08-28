<?php

namespace App\Http\Controllers;

use App\Actions\IrvanCloud\SyncMeetingsAction;
use App\Events\MeetingsListUpdated;
use App\Events\MeetingUpdated;
use App\Http\Requests\Meeting\StoreMeetingRequest;
use App\Http\Requests\Meeting\UpdateMeetingRequest;
use App\Models\Meeting;
use App\Models\MeetingActionItem;
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
        $query = Meeting::query()
            ->withCount('participants')
            ->with(['minutes' => function ($q) { $q->select('id', 'meeting_id', 'content'); }]);

        if ($request->search) {
            $query->where('title', 'ilike', '%'.$request->search.'%');
        }
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $meetings = $query->orderBy('date', 'desc')->paginate(10);
        $meetings->getCollection()->transform(function ($meeting) {
            $manualCount = 0;
            if ($meeting->minutes && $meeting->minutes->count() > 0) {
                $content = $meeting->minutes->first()->content;
                if (is_string($content)) {
                    $content = json_decode($content, true);
                }
                if (is_array($content) && isset($content['peserta_rapat']) && is_array($content['peserta_rapat'])) {
                    $manualCount = count($content['peserta_rapat']);
                }
            }
            $meeting->participants_count = max($meeting->participants_count ?? 0, $manualCount);
            unset($meeting->minutes);
            return $meeting;
        });

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
        $users = User::query()->where('status', 'aktif')->get(['id', 'name', 'department', 'initials']);

        $now = Carbon::now();

        $upcomingMeetingsRaw = Meeting::withCount('participants')
            ->with(['minutes' => function ($q) { $q->select('id', 'meeting_id', 'content'); }])
            ->where('date', '>=', $now->toDateString())
            ->whereIn('current_stage', [1, 2])
            ->orderBy('date', 'asc')
            ->orderBy('start_time', 'asc')
            ->take(3)
            ->get();
            
        $upcomingMeetings = $upcomingMeetingsRaw->map(function ($meeting) {
            $manualCount = 0;
            if ($meeting->minutes && $meeting->minutes->count() > 0) {
                $content = $meeting->minutes->first()->content;
                if (is_string($content)) {
                    $content = json_decode($content, true);
                }
                if (is_array($content) && isset($content['peserta_rapat']) && is_array($content['peserta_rapat'])) {
                    $manualCount = count($content['peserta_rapat']);
                }
            }
            $meeting->participants_count = max($meeting->participants_count ?? 0, $manualCount);
            unset($meeting->minutes);
            return $meeting;
        });

        $actionItems = MeetingActionItem::with(['meeting'])
            ->where('status', 'open')
            ->orderBy('deadline', 'asc')
            ->take(3)
            ->get();

        return Inertia::render('meetings/create', [
            'users' => $users,
            'upcomingMeetings' => $upcomingMeetings,
            'actionItems' => $actionItems,
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

        $start = Carbon::parse($validated['start_time']);
        $end = Carbon::parse($validated['end_time']);
        $validated['duration'] = $end->diffInSeconds($start);

        $validated['created_by'] = $request->user()->id;
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
                    'created_at' => now()->toDateTimeString(),
                    'updated_at' => now()->toDateTimeString(),
                ];
            }
            \Illuminate\Support\Facades\DB::table('meeting_participants')->insert($participants);
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
        $users = User::query()->where('status', 'aktif')->get(['id', 'name', 'department', 'initials']);

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

        $meeting->fill($validated);
        $meeting->save();

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

    public function cancel(Meeting $meeting)
    {
        abort_unless(request()->user()->can('meeting.update'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk membatalkan rapat.');

        $meeting->status = 'dibatalkan';
        $meeting->save();

        safe_broadcast(new MeetingUpdated($meeting, 'cancelled'));
        safe_broadcast(new MeetingsListUpdated('Rapat '.$meeting->title.' telah dibatalkan'));

        return redirect()->route('dashboard')->with('success', 'Rapat berhasil dibatalkan.');
    }

    public function destroy(Meeting $meeting)
    {
        abort_unless(request()->user()->can('meeting.delete'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk menghapus rapat.');

        safe_broadcast(new MeetingUpdated($meeting, 'deleted'));

        // Hapus file fisik rekaman audio dari storage
        $meeting->load('recordings');
        foreach ($meeting->recordings as $recording) {
            try {
                if (\Illuminate\Support\Facades\Storage::exists($recording->file_path)) {
                    \Illuminate\Support\Facades\Storage::delete($recording->file_path);
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning("Gagal menghapus file rekaman: " . $e->getMessage());
            }
        }
        
        // Hapus file dokumen dari storage
        $meeting->load('documents');
        foreach ($meeting->documents as $document) {
            try {
                if (\Illuminate\Support\Facades\Storage::exists($document->file_path)) {
                    \Illuminate\Support\Facades\Storage::delete($document->file_path);
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning("Gagal menghapus file dokumen: " . $e->getMessage());
            }
        }
        
        // Hapus direktori rekaman rapat ini agar bersih
        try {
            \Illuminate\Support\Facades\Storage::deleteDirectory('recordings/' . $meeting->id);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Gagal menghapus direktori rekaman: " . $e->getMessage());
        }

        // Hapus permanen rapat (termasuk relasinya jika diset cascade di DB)
        $meeting->forceDelete();

        safe_broadcast(new MeetingsListUpdated('Rapat telah dihapus'));

        return redirect()->back()->with('success', 'Rapat berhasil dihapus permanen beserta file rekamannya.');
    }
}
