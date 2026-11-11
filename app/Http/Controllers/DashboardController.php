<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingAttendance;
use App\Models\MeetingMinute;
use App\Models\MeetingParticipant;
use App\Models\Role;
use App\Models\TeamInvitation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
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
        $user = $request->user();
        $hasGlobalVisibility = $user && $user->hasRole(Role::CORE_ROLES);

        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        $computeStats = function (?User $scopedUser) use ($startOfMonth, $endOfMonth, $startOfLastMonth, $endOfLastMonth): array {
            $baseMeetingQuery = fn (): Builder => $scopedUser
                ? Meeting::query()->visibleTo($scopedUser)
                : Meeting::query();

            // 1. Rapat bulan ini
            $meetingsThisMonth = $baseMeetingQuery()->whereBetween('date', [$startOfMonth, $endOfMonth], 'and')->count('*');
            $meetingsLastMonth = $baseMeetingQuery()->whereBetween('date', [$startOfLastMonth, $endOfLastMonth], 'and')->count('*');
            $meetingsDelta = $meetingsLastMonth > 0
                ? round((($meetingsThisMonth - $meetingsLastMonth) / $meetingsLastMonth) * 100)
                : ($meetingsThisMonth > 0 ? 100 : 0);

            // 2. Notulen selesai
            $minutesCompletedThisMonth = MeetingMinute::query()
                ->whereHas('meeting', function ($q) use ($scopedUser) {
                    if ($scopedUser) {
                        $q->visibleTo($scopedUser);
                    }
                })
                ->where('status', 'disetujui')
                ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->count();
            $minutesCompletedLastMonth = MeetingMinute::query()
                ->whereHas('meeting', function ($q) use ($scopedUser) {
                    if ($scopedUser) {
                        $q->visibleTo($scopedUser);
                    }
                })
                ->where('status', 'disetujui')
                ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
                ->count();
            $minutesDelta = $minutesCompletedLastMonth > 0
                ? round((($minutesCompletedThisMonth - $minutesCompletedLastMonth) / $minutesCompletedLastMonth) * 100)
                : ($minutesCompletedThisMonth > 0 ? 100 : 0);

            // 3. Notulen dalam proses (Rapat yang sudah dimulai namun belum selesai / belum di-ACC Pimpinan)
            $openActionItems = $baseMeetingQuery()
                ->whereNotIn('status', ['selesai', 'dibatalkan'], 'and')
                ->where(function ($query) {
                    $query->where('current_stage', '>=', 2)
                        ->orWhereHas('minutes', function ($mq) {
                            $mq->where('status', '!=', 'disetujui');
                        });
                })
                ->count('*');

            // 4. Rata-rata kehadiran (SQL agregasi via whereHas agar tidak melebihi batas bind parameter UUID)
            $finishedScope = function ($mq) use ($scopedUser) {
                $mq->where('status', '=', 'selesai');
                if ($scopedUser) {
                    $mq->visibleTo($scopedUser);
                }
            };

            $totalAttended = MeetingAttendance::query()
                ->whereHas('meeting', $finishedScope)
                ->whereIn('status', ['hadir', 'terlambat'], 'and', false)
                ->count('*');
            $totalExpected = MeetingParticipant::query()
                ->whereHas('meeting', $finishedScope)
                ->count('*');
            $totalGuests = MeetingAttendance::query()
                ->whereHas('meeting', $finishedScope)
                ->whereNull('user_id', 'and', false)
                ->count('*');

            $totalTarget = $totalExpected + $totalGuests;
            $avgAttendance = $totalTarget > 0 ? (int) round(($totalAttended / $totalTarget) * 100) : 0;

            return [
                'meetingsThisMonth' => $meetingsThisMonth,
                'meetingsDelta' => $meetingsDelta,
                'minutesCompleted' => $minutesCompletedThisMonth,
                'minutesDelta' => $minutesDelta,
                'openActionItems' => $openActionItems,
                'avgAttendance' => $avgAttendance,
            ];
        };

        $stats = $hasGlobalVisibility
            ? Cache::remember('dashboard_stats_v2', 300, fn () => $computeStats(null))
            : $computeStats($user);

        // Fungsi helper untuk menghitung jumlah peserta manual dan mengubah ke array murni
        // agar tidak menjadi __PHP_Incomplete_Class saat di-unserialize dari Redis (serializable_classes = false)
        $adjustParticipants = fn ($meetings): array => $meetings
            ->map(fn (Meeting $meeting) => $meeting->resolveParticipantsCount()->toArray())
            ->values()
            ->all();

        $fetchTodayMeetings = function (?User $scopedUser) use ($now, $adjustParticipants): array {
            $query = Meeting::withCount('participants')
                ->with(['minutes' => function ($q) {
                    $q->select('id', 'meeting_id', 'content');
                }]);

            if ($scopedUser) {
                $query->visibleTo($scopedUser);
            }

            $todayMeetingsRaw = $query
                ->where(function ($query) use ($now) {
                    $query->where('date', '=', $now->toDateString())
                        ->orWhere(function ($pastQuery) use ($now) {
                            $pastQuery->where('date', '<', $now->toDateString())
                                ->whereNotIn('status', ['selesai', 'dibatalkan']);
                        })
                        ->orWhere(function ($activeFuture) {
                            $activeFuture->where('current_stage', '>=', 2)
                                ->whereNotIn('status', ['selesai', 'dibatalkan']);
                        });
                })
                ->where('status', '!=', 'dibatalkan')
                ->orderBy('date', 'desc')
                ->orderBy('start_time', 'asc')
                ->take(5)
                ->get();

            return $adjustParticipants($todayMeetingsRaw);
        };

        $fetchUpcomingMeetings = function (?User $scopedUser) use ($now, $adjustParticipants): array {
            $query = Meeting::withCount('participants')
                ->with(['minutes' => function ($q) {
                    $q->select('id', 'meeting_id', 'content');
                }]);

            if ($scopedUser) {
                $query->visibleTo($scopedUser);
            }

            $upcomingMeetingsRaw = $query
                ->where('date', '>', $now->toDateString())
                ->whereIn('current_stage', [1, 2], 'and', false) // Still scheduled or Humas Rekam
                ->orderBy('date', 'asc')
                ->orderBy('start_time', 'asc')
                ->take(5)
                ->get();

            return $adjustParticipants($upcomingMeetingsRaw);
        };

        // Rapat Hari Ini & Rapat Berjalan (Belum Selesai)
        $todayMeetings = $hasGlobalVisibility
            ? Cache::remember('dashboard_today_meetings_v2', 60, fn () => $fetchTodayMeetings(null))
            : $fetchTodayMeetings($user);

        // Jadwal Mendatang (Besok dan seterusnya)
        $upcomingMeetings = $hasGlobalVisibility
            ? Cache::remember('dashboard_upcoming_meetings_v2', 60, fn () => $fetchUpcomingMeetings(null))
            : $fetchUpcomingMeetings($user);

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
