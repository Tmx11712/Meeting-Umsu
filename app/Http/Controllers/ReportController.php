<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * @return Builder<Meeting>
     */
    private function buildReportQuery(Request $request): Builder
    {
        $query = Meeting::query()
            ->visibleTo($request->user())
            ->with('minutes', 'participants', 'attendances');

        if ($request->start_date && $request->end_date) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        if ($request->search) {
            $escaped = addcslashes((string) $request->search, '%_\\');
            $driver = DB::connection()->getDriverName();
            $likeOperator = $driver === 'pgsql' ? 'ilike' : 'like';
            $contentClause = $driver === 'pgsql' ? 'content::text ilike ?' : 'content like ?';

            $query->where(function (Builder $q) use ($escaped, $likeOperator, $contentClause) {
                $q->where('title', $likeOperator, '%'.$escaped.'%')
                    ->orWhereHas('minutes', function (Builder $mq) use ($escaped, $contentClause) {
                        $mq->whereRaw($contentClause, ['%'.$escaped.'%']);
                    });
            });
        }

        return $query->orderBy('date', 'desc');
    }

    public function index(Request $request)
    {
        abort_unless(
            $request->user()->can('report.read') || $request->user()->hasAnyRole(['Super Admin', 'Administrator', 'Bag. Umum', 'Bag. Humas', 'Pimpinan', 'Viewer']),
            403,
            'Akses Terbatas: Anda tidak memiliki izin untuk mengakses laporan.'
        );

        $meetings = $this->buildReportQuery($request)->paginate(20);

        // Return inertia view
        return Inertia::render('reports/index', [
            'meetings' => $meetings,
            'filters' => $request->only(['start_date', 'end_date', 'search']),
        ]);
    }

    public function download(Request $request)
    {
        abort_unless(
            $request->user()->can('report.read') || $request->user()->hasAnyRole(['Super Admin', 'Administrator', 'Bag. Umum', 'Bag. Humas', 'Pimpinan', 'Viewer']),
            403,
            'Akses Terbatas: Anda tidak memiliki izin untuk mengunduh laporan.'
        );

        $meetings = $this->buildReportQuery($request)->get();

        $pdf = Pdf::loadView('pdf.report', compact('meetings', 'request'));

        return $pdf->stream('Laporan_Notulen.pdf');
    }
}
