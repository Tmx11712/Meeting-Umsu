<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Meeting::query()->with('minutes', 'participants');

        if ($request->start_date && $request->end_date) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }
        
        $meetings = $query->orderBy('date', 'desc')->get();
        
        // Return inertia view
        return Inertia::render('reports/index', [
            'meetings' => $meetings,
            'filters' => $request->only(['start_date', 'end_date'])
        ]);
    }

    public function download(Request $request)
    {
        $query = Meeting::query()->with('minutes', 'participants');

        if ($request->start_date && $request->end_date) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }
        
        $meetings = $query->orderBy('date', 'desc')->get();

        $pdf = Pdf::loadView('pdf.report', compact('meetings', 'request'));
        return $pdf->download('Laporan_Notulen.pdf');
    }
}
