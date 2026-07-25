<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingActionItem;
use App\Models\MeetingMinute;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        if ($request->user() && ($request->user()->hasRole('Super Admin') || $request->user()->hasRole('Administrator'))) {
            return redirect()->route('configuration.index');
        }
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

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

        // Pipeline Data
        $pipeline_recording = Meeting::whereIn('current_stage', [1, 2])->orderBy('date')->orderBy('start_time')->get();
        $pipeline_correction = Meeting::whereIn('current_stage', [3, 4])->orderBy('date')->orderBy('start_time')->get();
        $pipeline_review = Meeting::whereIn('current_stage', [5])->orderBy('date')->orderBy('start_time')->get();
        $pipeline_approval = Meeting::whereIn('current_stage', [6])->orderBy('date')->orderBy('start_time')->get();
        $pipeline_finished = Meeting::whereIn('current_stage', [7])->orderBy('updated_at', 'desc')->take(10)->get(); // Limit to 10 recent finished

        return Inertia::render('dashboard', [
            'stats' => [
                'meetingsThisMonth' => $meetingsThisMonth,
                'meetingsDelta' => $meetingsDelta,
                'minutesCompleted' => $minutesCompletedThisMonth,
                'minutesDelta' => $minutesDelta,
                'openActionItems' => $openActionItems,
                'avgAttendance' => $avgAttendance,
            ],
            'pipelines' => [
                'recording' => $pipeline_recording,
                'correction' => $pipeline_correction,
                'review' => $pipeline_review,
                'approval' => $pipeline_approval,
                'finished' => $pipeline_finished,
            ]
        ]);
    }
}
