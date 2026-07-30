<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\User;
use App\Services\AbsensiApiService;
use App\Services\IrvanCloudSyncService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeetingController extends Controller
{
    public function index(Request $request)
    {
        $query = Meeting::query()->with('participants');

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

    public function fetchExternalSchedules(Request $request, AbsensiApiService $apiService)
    {
        $date = $request->query('date', now()->format('Y-m-d'));
        $schedules = $apiService->getSchedules($date);

        return response()->json($schedules);
    }

    public function syncFromIrvanCloud(Request $request, IrvanCloudSyncService $syncService)
    {
        $date = $request->query('date');
        // By default, it will sync current month's events
        $result = $syncService->syncMeetings();

        if ($result['success']) {
            return redirect()->route('meetings.index')->with('success', $result['message']);
        } else {
            return redirect()->route('meetings.index')->with('error', $result['message']);
        }
    }

    public function show(Meeting $meeting)
    {
        $meeting->load('participants.user', 'recordings', 'minutes');

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

    public function update(Request $request, Meeting $meeting)
    {
        abort_unless(auth()->user()->can('meeting.update'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk mengelola rapat.');

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'location' => 'required|string|max:255',
            'type' => 'required|string',
            'notes' => 'nullable|string',
            'participants' => 'required|array',
            'participants.*' => 'exists:users,id',
        ]);

        $start = Carbon::parse($validated['start_time']);
        $end = Carbon::parse($validated['end_time']);
        $validated['duration'] = $end->diffInSeconds($start);

        $meeting->update($validated);

        $meeting->participants()->delete();
        foreach ($validated['participants'] as $userId) {
            $meeting->participants()->create([
                'user_id' => $userId,
                'is_invited' => true,
            ]);
        }

        return redirect()->route('meetings.index')->with('success', 'Rapat berhasil diperbarui.');
    }

    public function destroy(Meeting $meeting)
    {
        abort_unless(auth()->user()->can('meeting.delete'), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk menghapus rapat.');

        $meeting->forceDelete();

        return redirect()->back()->with('success', 'Rapat berhasil dihapus permanen.');
    }
}
