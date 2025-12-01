<?php

namespace App\Http\Controllers\Teknisi;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index()
    {
        $teknisiId = Auth::id();

        $todayAttendance = Attendance::where('technician_user_id', $teknisiId)
            ->whereDate('clock_in', today())
            ->first();

        $isClockedIn = $todayAttendance && !$todayAttendance->clock_out;

        $history = Attendance::where('technician_user_id', $teknisiId)
            ->orderBy('clock_in', 'desc')
            ->paginate(10)
            ->through(fn ($att) => [
                'id' => $att->id,
                // PERBAIKAN: Konversi ke WIB (Asia/Jakarta) sebelum format tanggal
                'date' => $att->clock_in->timezone('Asia/Jakarta')->translatedFormat('l, d F Y'),
                'clock_in' => $att->clock_in->timezone('Asia/Jakarta')->translatedFormat('H:i:s'),
                'clock_out' => $att->clock_out ? $att->clock_out->timezone('Asia/Jakarta')->translatedFormat('H:i:s') : '-',
            ]);

        $todayAttendanceData = $todayAttendance ? [
            'id' => $todayAttendance->id,
            // PERBAIKAN: Konversi ke WIB untuk tampilan status hari ini
            'clock_in' => $todayAttendance->clock_in->timezone('Asia/Jakarta')->translatedFormat('d F Y, H:i'),
            'clock_out' => $todayAttendance->clock_out ? $todayAttendance->clock_out->timezone('Asia/Jakarta')->translatedFormat('d F Y, H:i') : null,
        ] : null;

        return Inertia::render('Teknisi/Attendance/Index', [
            'isClockedIn' => $isClockedIn,
            'todayAttendance' => $todayAttendanceData,
            'history' => $history,
        ]);
    }

    public function store(Request $request)
    {
        $teknisiId = Auth::id();

        $todayAttendance = Attendance::where('technician_user_id', $teknisiId)
            ->whereDate('clock_in', today())
            ->first();

        if ($todayAttendance && !$todayAttendance->clock_out) {
            $todayAttendance->update([
                'clock_out' => now(),
            ]);
        } elseif (!$todayAttendance) {
            Attendance::create([
                'technician_user_id' => $teknisiId,
                'clock_in' => now(),
            ]);
        }

        return Redirect::route('teknisi.attendance.index')->with('success', 'Absensi berhasil dicatat.');
    }
}