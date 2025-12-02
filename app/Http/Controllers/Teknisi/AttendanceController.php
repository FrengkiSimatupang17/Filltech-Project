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
    // Koordinat Kantor PT Filltech Berkah Bersama
    private const OFFICE_LAT = 1.0427899843782735;
    private const OFFICE_LNG = 103.94551310687659;
    private const MAX_RADIUS_METERS = 100;

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
                'date' => $att->clock_in->timezone('Asia/Jakarta')->translatedFormat('l, d F Y'),
                'clock_in' => $att->clock_in->timezone('Asia/Jakarta')->translatedFormat('H:i:s'),
                'clock_out' => $att->clock_out ? $att->clock_out->timezone('Asia/Jakarta')->translatedFormat('H:i:s') : '-',
            ]);

        $todayAttendanceData = $todayAttendance ? [
            'id' => $todayAttendance->id,
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
        // 1. Validasi Input Koordinat
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        // 2. Validasi Geofencing (Server Side)
        $distance = $this->calculateDistance(
            $request->latitude, 
            $request->longitude, 
            self::OFFICE_LAT, 
            self::OFFICE_LNG
        );

        // Toleransi 100 meter
        if ($distance > self::MAX_RADIUS_METERS) {
            return Redirect::back()->withErrors([
                'location' => 'Absensi Ditolak: Posisi Anda ' . round($distance) . 'm dari kantor (Maks ' . self::MAX_RADIUS_METERS . 'm).'
            ]);
        }

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

    /**
     * Menghitung jarak (Haversine Formula)
     */
    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371000; // Meter

        $latFrom = deg2rad($lat1);
        $lonFrom = deg2rad($lon1);
        $latTo = deg2rad($lat2);
        $lonTo = deg2rad($lon2);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
            cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));
        
        return $angle * $earthRadius;
    }
}