<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Models\MeetingRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

/**
 * [EDUKASI ARSITEKTUR: CRUD MASTER DATA (Ruangan Rapat)]
 * Controller ini mengelola CRUD untuk data Master Ruangan Rapat.
 *
 * Tabel master ini memungkinkan Admin menambah/mengubah/menonaktifkan ruangan
 * tanpa perlu menyentuh kode sama sekali. Data ruangan ini dipakai saat Admin
 * membuat jadwal rapat baru sebagai pilihan dropdown lokasi rapat.
 */
class MeetingRoomController extends Controller
{
    public function index()
    {
        $rooms = MeetingRoom::orderBy('name', 'asc')->paginate(10);

        return Inertia::render('configuration/meeting-rooms/index', [
            'rooms' => $rooms,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:meeting_rooms,name',
            'is_active' => 'boolean',
        ]);

        MeetingRoom::create($validated);
        Cache::forget('active_meeting_rooms');

        return redirect()->back()->with('success', 'Ruangan rapat berhasil ditambahkan.');
    }

    public function update(Request $request, MeetingRoom $meetingRoom)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('meeting_rooms', 'name')->ignore($meetingRoom->id)],
            'is_active' => 'boolean',
        ]);

        $meetingRoom->update($validated);
        Cache::forget('active_meeting_rooms');

        return redirect()->back()->with('success', 'Ruangan rapat berhasil diperbarui.');
    }

    public function destroy(MeetingRoom $meetingRoom)
    {
        $meetingRoom->delete();
        Cache::forget('active_meeting_rooms');

        return redirect()->back()->with('success', 'Ruangan rapat berhasil dihapus.');
    }
}
