<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class AdminAttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::with('technician');

        if ($request->has('technician_id') && $request->technician_id) {
            $query->where('technician_user_id', $request->technician_id);
        }

        $history = $query->orderBy('clock_in', 'desc')
            ->paginate(15)
            ->withQueryString()
            ->through(fn ($att) => [
                'id' => $att->id,
                'technician_name' => $att->technician->name ?? 'N/A',
                'is_late' => $att->is_late,
                'date' => $att->clock_in->timezone('Asia/Jakarta')->translatedFormat('d M Y'),
                'clock_in' => $att->clock_in->timezone('Asia/Jakarta')->format('H:i'),
                'clock_out' => $att->clock_out ? $att->clock_out->timezone('Asia/Jakarta')->format('H:i') : '-',
            ]);

        $technicians = User::where('role', 'teknisi')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/AttendanceReport/Index', [
            'history' => $history,
            'technicians' => $technicians,
            'filters' => $request->only(['technician_id']),
        ]);
    }

    public function exportPdf(Request $request)
    {
        $query = Attendance::with('technician');

        $technicianName = "Semua Teknisi";
        $filterInfo = "Semua Data";

        if ($request->has('technician_id') && $request->technician_id) {
            $query->where('technician_user_id', $request->technician_id);
            $tech = User::find($request->technician_id);
            if ($tech) {
                $technicianName = $tech->name;
                $filterInfo = "Filter: " . $tech->name;
            }
        }

        // Ambil data
        $attendanceData = $query->orderBy('clock_in', 'desc')->get();

        // Hitung Statistik Ringkasan
        $summary = [
            'total' => $attendanceData->count(),
            'late' => $attendanceData->where('is_late', true)->count(),
            'on_time' => $attendanceData->where('is_late', false)->count(),
        ];

        $pdf = Pdf::loadView('exports.attendance_report', [
            'data' => $attendanceData,
            'summary' => $summary,
            'technicianName' => $technicianName,
            'filterInfo' => $filterInfo,
            'date' => now()->timezone('Asia/Jakarta')->translatedFormat('d F Y, H:i'),
        ])->setPaper('a4', 'portrait');
        
        return $pdf->download('Laporan_Absensi_' . now()->format('Ymd_His') . '.pdf');
    }
}