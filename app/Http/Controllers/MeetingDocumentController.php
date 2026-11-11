<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MeetingDocumentController extends Controller
{
    public function store(Request $request, Meeting $meeting): RedirectResponse
    {
        $this->authorize('view', $meeting);
        $meeting->ensureMutableForEdits();

        abort_unless(
            $request->user()->can('minute.update') || $request->user()->can('review.update') || $request->user()->hasRole(['Bag. Humas', 'Bag. Umum', 'Super Admin', 'Administrator']),
            403,
            'Akses Terbatas: Anda tidak memiliki izin untuk mengunggah dokumen.'
        );

        $request->validate([
            'document' => 'required|file|mimes:pdf,txt,docx|max:10240', // 10MB max, PDF, TXT, DOCX only
        ], [
            'document.mimes' => 'Hanya format PDF, TXT, dan DOCX yang didukung agar bisa dianalisis oleh AI.',
            'document.max' => 'Ukuran maksimal file adalah 10MB.',
        ]);

        $file = $request->file('document');
        $rawName = basename(str_replace(['/', '\\', "\0"], '-', $file->getClientOriginalName()));
        $fileName = $rawName !== '' ? $rawName : 'dokumen';
        $fileSize = $file->getSize();
        $mimeType = $file->getMimeType();

        // Generate unique name berbasis MIME tervalidasi dan direktori berbasis UUID rapat
        $extension = $file->extension() ?: 'bin';
        $uuidName = Str::uuid()->toString().'.'.$extension;
        $path = $file->storeAs("documents/{$meeting->id}", $uuidName);

        try {
            $document = MeetingDocument::create([
                'meeting_id' => $meeting->id,
                'file_path' => $path,
                'file_name' => $fileName,
                'file_size' => $fileSize,
                'mime_type' => $mimeType,
                'category' => 'Lainnya',
                'uploaded_by' => $request->user()->id,
            ]);
        } catch (\Exception $e) {
            try {
                if ($path) {
                    Storage::delete($path);
                }
            } catch (\Throwable $e2) {
                Log::warning('Gagal rollback hapus dokumen: '.$e2->getMessage());
            }
            throw $e;
        }

        return redirect()->back()->with('success', 'Dokumen berhasil diunggah.');
    }

    public function destroy(Meeting $meeting, MeetingDocument $document): RedirectResponse
    {
        $this->authorize('view', $meeting);
        $meeting->ensureMutableForEdits();

        abort_unless(
            request()->user()->can('minute.update') || request()->user()->can('review.update') || request()->user()->hasRole(['Bag. Humas', 'Bag. Umum', 'Super Admin', 'Administrator']),
            403,
            'Akses Terbatas: Anda tidak memiliki izin untuk menghapus dokumen.'
        );

        if ($document->meeting_id !== $meeting->id) {
            abort(403);
        }

        $filePath = $document->file_path;

        $document->deleteOrFail();

        // Pindahkan proses hapus file fisik ke background agar response instan
        app()->terminating(function () use ($filePath) {
            try {
                if ($filePath && Storage::exists($filePath)) {
                    Storage::delete($filePath);
                }
            } catch (\Throwable $e) {
                Log::warning('Gagal menghapus file dokumen di Storage: '.$e->getMessage());
            }
        });

        return redirect()->back()->with('success', 'Dokumen berhasil dihapus.');
    }

    public function download(Meeting $meeting, MeetingDocument $document)
    {
        $this->authorize('view', $meeting);

        abort_if($document->meeting_id !== $meeting->id, 404);
        abort_unless(Storage::exists($document->file_path), 404, 'File dokumen tidak ditemukan.');

        $downloadName = basename(str_replace(['/', '\\', "\0"], '-', (string) $document->file_name)) ?: 'dokumen';

        return Storage::download($document->file_path, $downloadName, [
            'Content-Type' => $document->mime_type,
        ]);
    }
}
