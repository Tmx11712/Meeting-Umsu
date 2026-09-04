<?php

namespace App\Http\Controllers\Api;

use App\Actions\Meetings\SyncMeetingAttendanceAction;
use App\Actions\Users\UpsertUserFromExternalAction;
use App\Events\MeetingsListUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreManualMeetingApiRequest;
use App\Http\Resources\MeetingResource;
use App\Models\Meeting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MeetingApiController extends Controller
{
    /**
     * Display a listing of meetings.
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

        if ($request->source) {
            $query->where('source', '=', $request->source);
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
     * Store a newly created meeting via API (supports standard & Irvan Cloud formats).
     */
    public function store(
        StoreManualMeetingApiRequest $request,
        UpsertUserFromExternalAction $upsertUserAction,
        SyncMeetingAttendanceAction $syncAttendanceAction
    ): JsonResponse {
        $validated = $request->validated();

        $start = Carbon::parse($validated['start_time']);
        $end = Carbon::parse($validated['end_time']);
        $duration = $end->diffInSeconds($start);

        // Fallback creator to Super Admin if unauthenticated / not specified
        $createdBy = $validated['created_by'] ?? $request->user()?->id;
        if (empty($createdBy)) {
            $superAdmin = User::query()
                ->whereHas('roles', fn ($q) => $q->where('name', '=', 'Super Admin'))
                ->first() ?? User::query()->first();

            $createdBy = $superAdmin?->id;
        }

        $externalId = $validated['uuid'] ?? $validated['external_id'] ?? Str::uuid()->toString();

        $meetingData = [
            'title' => $validated['title'],
            'description' => $validated['description'] ?? '',
            'date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'duration' => $duration,
            'location' => $validated['location'],
            'type' => $validated['type'],
            'category' => $validated['category'] ?? 'Umum',
            'status' => 'terjadwal',
            'source' => 'manual',
            'external_id' => $externalId,
            'current_stage' => 1,
            'created_by' => $createdBy,
        ];

        if (! empty($validated['agenda'])) {
            $meetingData['notes'] = json_encode(['agenda' => $validated['agenda']]);
        }

        // Upsert logic: prevent duplicates if UUID / external_id already exists
        $meeting = null;
        if (! empty($externalId)) {
            $meeting = Meeting::query()->where('external_id', '=', $externalId)->first();
        }

        if ($meeting) {
            $meeting->fill($meetingData)->save();
        } else {
            $meeting = Meeting::create($meetingData);
        }

        // Process participants if provided
        if (! empty($validated['participants'])) {
            foreach ($validated['participants'] as $participant) {
                // Case 1: Participant is an object with email (Irvan Cloud format)
                if (is_array($participant) && ! empty($participant['email'])) {
                    $user = $upsertUserAction->execute($participant);
                    if ($user) {
                        $syncAttendanceAction->execute($participant, $meeting, $user);
                    }
                }
                // Case 2: Participant is a User UUID string
                elseif (is_string($participant) && Str::isUuid($participant)) {
                    DB::table('meeting_participants')->insertOrIgnore([
                        'id' => Str::uuid()->toString(),
                        'meeting_id' => $meeting->id,
                        'user_id' => $participant,
                        'is_invited' => true,
                        'created_at' => now()->toDateTimeString(),
                        'updated_at' => now()->toDateTimeString(),
                    ]);
                }
                // Case 3: Participant is an email string
                elseif (is_string($participant) && filter_var($participant, FILTER_VALIDATE_EMAIL)) {
                    $user = $upsertUserAction->execute(['email' => $participant]);
                    if ($user) {
                        $syncAttendanceAction->execute(['email' => $participant], $meeting, $user);
                    }
                }
            }
        }

        safe_broadcast(new MeetingsListUpdated('Rapat baru "'.$meeting->title.'" telah dijadwalkan'));

        return response()->json([
            'statusCode' => 201,
            'success' => true,
            'message' => 'The events data was created successfully.',
            'data' => new MeetingResource($meeting->load(['createdBy', 'participants.user'])),
        ], 201);
    }

    /**
     * Display the specified meeting.
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
