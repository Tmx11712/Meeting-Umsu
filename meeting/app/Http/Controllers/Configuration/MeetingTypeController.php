<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\MeetingType;
use Inertia\Inertia;

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
        return redirect()->back()->with('success', 'Tipe rapat berhasil ditambahkan.');
    }

    public function update(Request $request, MeetingType $meetingType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:meeting_types,name,' . $meetingType->id,
            'is_active' => 'boolean',
        ]);

        $meetingType->update($validated);
        return redirect()->back()->with('success', 'Tipe rapat berhasil diperbarui.');
    }

    public function destroy(MeetingType $meetingType)
    {
        $meetingType->delete();
        return redirect()->back()->with('success', 'Tipe rapat berhasil dihapus.');
    }
}
