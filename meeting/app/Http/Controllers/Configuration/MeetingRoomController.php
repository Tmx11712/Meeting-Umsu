<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\MeetingRoom;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
            'name' => 'required|string|max:255|unique:meeting_rooms,name,' . $meetingRoom->id,
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
