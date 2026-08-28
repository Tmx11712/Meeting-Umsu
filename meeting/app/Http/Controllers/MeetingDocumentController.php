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
        $path = $file->storeAs('documents', $uuidName);

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
            try {
                if ($path) {
                    Storage::delete($path);
                }
            } catch (\Throwable $e2) {
                \Illuminate\Support\Facades\Log::warning("Gagal rollback hapus dokumen: " . $e2->getMessage());
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

        try {
            if (Storage::exists($document->file_path)) {
                Storage::delete($document->file_path);
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("Gagal menghapus file dokumen di Storage: " . $e->getMessage());
        }

        $document->deleteOrFail();

        return redirect()->back()->with('success', 'Dokumen berhasil dihapus.');
    }

    public function download(Meeting $meeting, MeetingDocument $document)
    {
        abort_unless(request()->user()->can('review.read') || request()->user()->hasRole(['Pimpinan', 'Bag. Humas', 'Bag. Umum', 'Super Admin', 'Administrator']), 403, 'Akses Terbatas.');

        abort_if($document->meeting_id !== $meeting->id, 404);
        abort_unless(Storage::exists($document->file_path), 404, 'File dokumen tidak ditemukan.');

        return Storage::download($document->file_path, $document->file_name, [
            'Content-Type' => $document->mime_type,
        ]);
    }
}
