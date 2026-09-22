<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MeetingResource;
use App\Models\Meeting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * [EDUKASI ARSITEKTUR: REST API CONTROLLER (Konsumsi Data Rapat)]
 * Controller ini menyediakan data Rapat dalam format JSON untuk dikonsumsi pihak eksternal.
 *
 * `MeetingResource` (Eloquent API Resource) digunakan sebagai "transformer":
 * ia memastikan hanya field-field yang kita pilih yang dikirim ke luar (keamanan data).
 * Misalnya, kita tidak ingin mengirim field `created_at` atau `external_id` ke aplikasi mobile.
 */
class MeetingApiController extends Controller
{
    /**
     * Mengambil daftar jadwal rapat (GET /api/meetings).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Meeting::query()->with(['createdBy', 'participants.user']);

        if ($request->search) {
            $query->where('title', 'ilike', '%'.$request->search.'%');
        }

        if ($request->date || $request->event_date) {
            $query->whereDate('date', $request->date ?? $request->event_date);
        }

        if ($request->status && $request->status !== 'all') {
            $query->where('status', '=', $request->status);
        }

        $perPage = max(1, min(100, $request->integer('per_page', 15)));
        $meetings = $query->orderBy('date', 'desc')
            ->orderBy('start_time', 'asc')
            ->paginate($perPage);

        return response()->json([
            'statusCode' => 200,
            'success' => true,
            'message' => 'The events data was retrieved successfully.',
            'data' => MeetingResource::collection($meetings),
            'pagination' => [
                'current_page' => $meetings->currentPage(),
                'last_page' => $meetings->lastPage(),
                'per_page' => $meetings->perPage(),
                'total' => $meetings->total(),
            ],
        ]);
    }

    /**
     * Mengambil rincian 1 rapat spesifik (GET /api/meetings/{id}).
     */
    public function show(Meeting $meeting): JsonResponse
    {
        return response()->json([
            'statusCode' => 200,
            'success' => true,
            'message' => 'The events data was retrieved successfully.',
            'data' => new MeetingResource($meeting->load(['createdBy', 'participants.user'])),
        ]);
    }
}
