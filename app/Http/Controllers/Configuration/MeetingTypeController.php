<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Models\MeetingType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

/**
 * [EDUKASI ARSITEKTUR: CRUD MASTER DATA (Jenis Rapat)]
 * Controller ini mengelola CRUD untuk data Master Jenis Rapat.
 * Sama polanya dengan MeetingRoomController, ini memungkinkan Admin mengatur kategori rapat
 * (misal: 'Rapat Dinas', 'Rapat Koordinasi', 'Rapat Pleno') secara dinamis tanpa perlu ubah kode.
 */
class MeetingTypeController extends Controller
{
    public function index()
    {
        $types = MeetingType::orderBy('name', 'asc')->paginate(10);

        return Inertia::render('configuration/meeting-types/index', [
            'types' => $types,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:meeting_types,name',
            'is_active' => 'boolean',
        ]);

        MeetingType::create($validated);
        Cache::forget('active_meeting_types');

        return redirect()->back()->with('success', 'Tipe rapat berhasil ditambahkan.');
    }

    public function update(Request $request, MeetingType $meetingType)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('meeting_types', 'name')->ignore($meetingType->id)],
            'is_active' => 'boolean',
        ]);

        $meetingType->update($validated);
        Cache::forget('active_meeting_types');

        return redirect()->back()->with('success', 'Tipe rapat berhasil diperbarui.');
    }

    public function destroy(MeetingType $meetingType)
    {
        $meetingType->delete();
        Cache::forget('active_meeting_types');

        return redirect()->back()->with('success', 'Tipe rapat berhasil dihapus.');
    }
}
