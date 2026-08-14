<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingActionItem;
use App\Models\MeetingMinute;
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
        $stats = Cache::remember('dashboard_stats', 300, function () use ($now, $startOfMonth, $startOfLastMonth, $endOfLastMonth) {
            // 1. Rapat bulan ini
            $meetingsThisMonth = Meeting::whereBetween('date', [$startOfMonth, $now->endOfMonth()])->count();
            $meetingsLastMonth = Meeting::whereBetween('date', [$startOfLastMonth, $endOfLastMonth])->count();
            $meetingsDelta = $meetingsLastMonth > 0
                ? round((($meetingsThisMonth - $meetingsLastMonth) / $meetingsLastMonth) * 100)
                : 100;

            // 2. Notulen selesai
            $minutesCompletedThisMonth = MeetingMinute::where('status', 'disetujui')
                ->whereBetween('created_at', [$startOfMonth, $now->endOfMonth()])
                ->count();
            $minutesCompletedLastMonth = MeetingMinute::where('status', 'disetujui')
                ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
                ->count();
            $minutesDelta = $minutesCompletedLastMonth > 0
                ? round((($minutesCompletedThisMonth - $minutesCompletedLastMonth) / $minutesCompletedLastMonth) * 100)
                : 100;

            // 3. Action item terbuka
            $openActionItems = MeetingActionItem::where('status', 'open')->count();

            // 4. Rata-rata kehadiran
            $avgAttendance = 0; // Simplified for now, calculate from finished meetings
            $finishedMeetings = Meeting::with('attendances')->where('status', 'selesai')->get();
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

        // Latest Meetings (Rapat terbaru)
        $latestMeetings = Meeting::withCount('participants')
            ->orderBy('date', 'desc')
            ->orderBy('start_time', 'desc')
            ->take(5)
            ->get();

        // Upcoming Meetings (Jadwal mendatang)
        $upcomingMeetings = Meeting::withCount('participants')
            ->where('date', '>=', $now->toDateString())
            ->whereIn('current_stage', [1, 2]) // Still scheduled or Humas Rekam
            ->where(function($query) {
                $query->where('category', '!=', 'action_item_mendesak')
                      ->orWhereNull('category');
            })
            ->orderBy('date', 'asc')
            ->orderBy('start_time', 'asc')
            ->take(3)
            ->get();

        // Action Items Mendesak (Dikustomisasi untuk hanya menampilkan Rapat Mendesak)
        $actionItems = Meeting::where('category', 'action_item_mendesak')
            ->where('date', '>=', $now->toDateString())
            ->orderBy('date', 'asc')
            ->take(3)
            ->get()
            ->map(function ($m) {
                return [
                    'id' => 'm_' . $m->id,
                    'meeting_id' => $m->id,
                    'description' => $m->title,
                    'deadline' => $m->date,
                    'pic' => '-', // Tidak ada PIC spesifik karena ini adalah Rapat
                ];
            });

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'latestMeetings' => $latestMeetings,
            'upcomingMeetings' => $upcomingMeetings,
            'actionItems' => $actionItems,
        ]);
    }
}
