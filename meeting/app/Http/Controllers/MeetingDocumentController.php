<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingDocument;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MeetingDocumentController extends Controller
{
    public function store(Request $request, Meeting $meeting): \Illuminate\Http\RedirectResponse
    {
        abort_unless(request()->user()->can('review.update') || request()->user()->hasRole(['Bag. Humas', 'Bag. Umum', 'Super Admin', 'Administrator']), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk mengunggah dokumen.');

        $request->validate([
            'document' => 'required|file|mimes:pdf,txt|max:10240', // 10MB max, PDF & TXT only
        ], [
            'document.mimes' => 'Hanya format PDF dan TXT yang didukung agar bisa dianalisis oleh AI.',
            'document.max' => 'Ukuran maksimal file adalah 10MB.',
        ]);

        $file = $request->file('document');
        $fileName = $file->getClientOriginalName();
        $fileSize = $file->getSize();
        $mimeType = $file->getMimeType();

        // Generate unique name
        $uuidName = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs('documents', $uuidName, 'public');

        try {
            $document = MeetingDocument::create([
                'meeting_id' => $meeting->id,
                'file_path' => $path,
                'file_name' => $fileName,
                'file_size' => $fileSize,
                'mime_type' => $mimeType,
                'category' => 'Lainnya',
                'uploaded_by' => $request->user()?->id ?? User::query()->first()?->id,
            ]);
        } catch (\Exception $e) {
            if ($path) {
                Storage::delete($path);
            }
            throw $e;
        }

        return redirect()->back()->with('success', 'Dokumen berhasil diunggah.');
    }

    public function destroy(Meeting $meeting, MeetingDocument $document): \Illuminate\Http\RedirectResponse
    {
        abort_unless(request()->user()->can('review.update') || request()->user()->hasRole(['Humas', 'Umum']), 403, 'Akses Terbatas: Anda tidak memiliki izin untuk menghapus dokumen.');

        if ($document->meeting_id !== $meeting->id) {
            abort(403);
        }

        if (Storage::exists($document->file_path)) {
            Storage::delete($document->file_path);
        }

        $document->deleteOrFail();

        return redirect()->back()->with('success', 'Dokumen berhasil dihapus.');
    }
}
