<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingActionItem;
use App\Models\MeetingMinute;
use App\Models\TeamInvitation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

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
                : 100;

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
                : 100;

            // 3. Action item terbuka
            $openActionItems = MeetingActionItem::whereHas('meeting')->where('status', 'open')->count();

            // 4. Rata-rata kehadiran
            $avgAttendance = 0; // Simplified for now, calculate from finished meetings
            $finishedMeetings = Meeting::with('attendances')->where('status', '=', 'selesai', 'and')->get();
            if ($finishedMeetings->count() > 0) {
                $totalRates = $finishedMeetings->map->attendance_rate->sum();
                $avgAttendance = round($totalRates / $finishedMeetings->count());
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

        // Rapat Hari Ini & Rapat Tertunda (Belum Selesai)
        $todayMeetingsRaw = Meeting::withCount('participants')
            ->with(['minutes' => function ($q) {
                $q->select('id', 'meeting_id', 'content');
            }])
            ->where(function ($query) use ($now) {
                $query->where('date', '=', $now->toDateString())
                      ->orWhere('date', '<', $now->toDateString())
                      ->orWhere('current_stage', '>=', 3); // Rapat yang sudah dimulai (stage 3+) selalu tampil di sini meski tanggal aslinya di masa depan
            })
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
