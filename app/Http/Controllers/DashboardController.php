<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingActionItem;
use App\Models\MeetingAttendance;
use App\Models\MeetingMinute;
use App\Models\MeetingParticipant;
use App\Models\TeamInvitation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

/**
 * [EDUKASI ARSITEKTUR: SINGLE ACTION CONTROLLER (Invokable)]
 * Controller ini menggunakan pola "Invokable Controller" - yaitu controller yang hanya punya SATU method: `__invoke`.
 * Cocok digunakan untuk halaman/aksi tunggal yang tidak membutuhkan banyak method CRUD.
 *
 * Perhatikan juga penggunaan `Cache::remember()` di dalam method ini.
 * Ini adalah teknik "Query Result Caching": hasil query yang lambat (menghitung statistik) disimpan
 * sementara di cache (Redis/File). Jika ada request dalam 60 detik berikutnya, hasilnya
 * diambil dari cache (super cepat!) dan database tidak perlu dihitung ulang.
 */
class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        /**
         * [EDUKASI ARSITEKTUR: BACKEND CACHING]
         * Daripada melakukan query COUNT() ke database setiap kali user me-refresh halaman (yang bisa membuat server jebol saat traffic tinggi),
         * kita menyimpan hasilnya di RAM (Cache) selama 5 menit (300 detik).
         * Trade-off: Data statistik mungkin terlambat maksimal 5 menit, tapi performa server meningkat 99%.
         */
        $endOfMonth = $now->copy()->endOfMonth();

        $stats = Cache::remember('dashboard_stats', 300, function () use ($startOfMonth, $endOfMonth, $startOfLastMonth, $endOfLastMonth) {
            // 1. Rapat bulan ini
            $meetingsThisMonth = Meeting::query()->whereBetween('date', [$startOfMonth, $endOfMonth], 'and')->count('*');
            $meetingsLastMonth = Meeting::query()->whereBetween('date', [$startOfLastMonth, $endOfLastMonth], 'and')->count('*');
            $meetingsDelta = $meetingsLastMonth > 0
                ? round((($meetingsThisMonth - $meetingsLastMonth) / $meetingsLastMonth) * 100)
                : ($meetingsThisMonth > 0 ? 100 : 0);

            // 2. Notulen selesai
            $minutesCompletedThisMonth = MeetingMinute::whereHas('meeting')
                ->where('status', 'disetujui')
                ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->count();
            $minutesCompletedLastMonth = MeetingMinute::whereHas('meeting')
                ->where('status', 'disetujui')
                ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
                ->count();
            $minutesDelta = $minutesCompletedLastMonth > 0
                ? round((($minutesCompletedThisMonth - $minutesCompletedLastMonth) / $minutesCompletedLastMonth) * 100)
                : ($minutesCompletedThisMonth > 0 ? 100 : 0);

            // 3. Action item terbuka
            $openActionItems = MeetingActionItem::whereHas('meeting')->where('status', 'open')->count();

            // 4. Rata-rata kehadiran (Dihitung efisien via SQL Agregasi pada rapat yang telah selesai)
            $avgAttendance = 0;
            $finishedMeetingIds = Meeting::query()->where('status', '=', 'selesai', 'and')->pluck('id');
            if ($finishedMeetingIds->isNotEmpty()) {
                $totalAttended = MeetingAttendance::query()
                    ->whereIn('meeting_id', $finishedMeetingIds, 'and', false)
                    ->whereIn('status', ['hadir', 'terlambat'], 'and', false)
                    ->count('*');
                $totalExpected = MeetingParticipant::query()
                    ->whereIn('meeting_id', $finishedMeetingIds, 'and', false)
                    ->count('*');
                $totalGuests = MeetingAttendance::query()
                    ->whereIn('meeting_id', $finishedMeetingIds, 'and', false)
                    ->whereNull('user_id', 'and', false)
                    ->count('*');
                $totalTarget = $totalExpected + $totalGuests;
                $avgAttendance = $totalTarget > 0 ? (int) round(($totalAttended / $totalTarget) * 100) : 0;
            }

            return [
                'meetingsThisMonth' => $meetingsThisMonth,
                'meetingsDelta' => $meetingsDelta,
                'minutesCompleted' => $minutesCompletedThisMonth,
                'minutesDelta' => $minutesDelta,
                'openActionItems' => $openActionItems,
                'avgAttendance' => $avgAttendance,
            ];
        });

        // Fungsi helper untuk menghitung jumlah peserta manual
        $adjustParticipants = function ($meetings) {
            return $meetings->map(function ($meeting) {
                $manualCount = 0;
                if ($meeting->minutes && $meeting->minutes->count() > 0) {
                    $content = $meeting->minutes->first()->content;
                    if (is_string($content)) {
                        $content = json_decode($content, true);
                    }
                    if (is_array($content) && isset($content['peserta_rapat']) && is_array($content['peserta_rapat'])) {
                        $manualCount = count($content['peserta_rapat']);
                    }
                }
                $meeting->participants_count = max($meeting->participants_count ?? 0, $manualCount);
                unset($meeting->minutes); // Hapus agar payload Inertia tidak membengkak

                return $meeting;
            });
        };

        // Rapat Hari Ini & Rapat Berjalan (Belum Selesai)
        $todayMeetingsRaw = Meeting::withCount('participants')
            ->with(['minutes' => function ($q) {
                $q->select('id', 'meeting_id', 'content');
            }])
            ->where(function ($query) use ($now) {
                $query->where('date', '=', $now->toDateString())
                    ->orWhere(function ($pastQuery) use ($now) {
                        $pastQuery->where('date', '<', $now->toDateString())
                            ->whereNotIn('status', ['selesai', 'dibatalkan']);
                    })
                    ->orWhere(function ($activeFuture) {
                        $activeFuture->where('current_stage', '>=', 3)
                            ->whereNotIn('status', ['selesai', 'dibatalkan']);
                    });
            })
            ->where('status', '!=', 'dibatalkan')
            ->orderBy('date', 'desc')
            ->orderBy('start_time', 'asc')
            ->take(5)
            ->get();
        $todayMeetings = $adjustParticipants($todayMeetingsRaw);

        // Jadwal Mendatang (Besok dan seterusnya)
        $upcomingMeetingsRaw = Meeting::withCount('participants')
            ->with(['minutes' => function ($q) {
                $q->select('id', 'meeting_id', 'content');
            }])
            ->where('date', '>', $now->toDateString())
            ->whereIn('current_stage', [1, 2], 'and', false) // Still scheduled or Humas Rekam
            ->orderBy('date', 'asc')
            ->orderBy('start_time', 'asc')
            ->take(5)
            ->get();
        $upcomingMeetings = $adjustParticipants($upcomingMeetingsRaw);

        $pendingInvitations = [];
        if ($request->user()) {
            $pendingInvitations = TeamInvitation::with(['team', 'inviter'])
                ->where('email', '=', $request->user()->email)
                ->whereNull('accepted_at', 'and', false)
                ->where(function ($query) use ($now) {
                    $query->whereNull('expires_at', 'and', false)
                        ->orWhere('expires_at', '>', $now);
                })
                ->get()
                ->map(function ($invitation) {
                    return [
                        'id' => $invitation->id,
                        'code' => $invitation->code,
                        'team' => [
                            'name' => $invitation->team->name,
                            'slug' => $invitation->team->slug,
                        ],
                        'inviterName' => $invitation->inviter->name,
                        'created_at' => $invitation->created_at,
                    ];
                });
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'todayMeetings' => $todayMeetings,
            'upcomingMeetings' => $upcomingMeetings,
            'pendingInvitations' => $pendingInvitations,
        ]);
    }
}
