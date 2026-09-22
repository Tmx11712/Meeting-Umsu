<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Models\MeetingRoom;
use Illuminate\Http\Request;
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

        return redirect()->back()->with('success', 'Ruangan rapat berhasil ditambahkan.');
    }

    public function update(Request $request, MeetingRoom $meetingRoom)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:meeting_rooms,name,'.$meetingRoom->id,
            'is_active' => 'boolean',
        ]);

        $meetingRoom->update($validated);

        return redirect()->back()->with('success', 'Ruangan rapat berhasil diperbarui.');
    }

    public function destroy(MeetingRoom $meetingRoom)
    {
        $meetingRoom->delete();

        return redirect()->back()->with('success', 'Ruangan rapat berhasil dihapus.');
    }
}
