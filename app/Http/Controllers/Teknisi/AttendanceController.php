<?php

namespace App\Http\Controllers\Teknisi;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    /**
     * Menampilkan halaman absensi.
     * Koordinat kantor diambil dari Config agar tidak hardcoded.
     */
    public function index()
    {
        // Pakai Carbon dengan Timezone Jakarta untuk hari ini
        $today = Carbon::now('Asia/Jakarta')->format('Y-m-d');

        // Cek apakah hari ini sudah absen masuk
        $todayAttendance = Attendance::where('user_id', Auth::id())
            ->whereDate('date', $today)
            ->first();

        // Riwayat 5 hari terakhir
        $history = Attendance::where('user_id', Auth::id())
            ->latest('date')
            ->take(5)
            ->get();

        // Ambil Koordinat dari Config/Env (Best Practice)
        $officeLat = (float) config('services.office.latitude');
        $officeLng = (float) config('services.office.longitude');

        return Inertia::render('Teknisi/Attendance/Index', [
            'todayAttendance' => $todayAttendance,
            'history' => $history,
            'officeLocation' => [
                'lat' => $officeLat,
                'lng' => $officeLng
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'type' => 'required|in:clock_in,clock_out',
        ]);

        // 1. Ambil Konfigurasi Kantor dari Environment
        $officeLat = (float) config('services.office.latitude');
        $officeLng = (float) config('services.office.longitude');
        $allowedRadius = (int) config('services.office.radius');

        // 2. Cek Jarak (Geofencing)
        $distance = $this->calculateDistance($request->latitude, $request->longitude, $officeLat, $officeLng);

        if ($distance > $allowedRadius) {
            return redirect()->back()->withErrors(['location' => "Gagal! Anda berada di luar radius kantor ({$distance} meter)."]);
        }

        // [PENTING] Set Waktu Sekarang ke Asia/Jakarta
        $now = Carbon::now('Asia/Jakarta');
        $todayDate = $now->format('Y-m-d');
        
        // 3. Logic Clock In / Out
        if ($request->type === 'clock_in') {
            // Cek duplikasi
            $exists = Attendance::where('user_id', Auth::id())
                ->whereDate('date', $todayDate)
                ->exists();

            if ($exists) {
                return redirect()->back()->with('error', 'Anda sudah absen masuk hari ini.');
            }

            // --- LOGIKA JAM KANTOR (08:00 WIB) ---
            // Buat objek waktu jam 08:00 hari ini (Asia/Jakarta)
            $officeStartTime = Carbon::createFromTime(8, 0, 0, 'Asia/Jakarta');
            
            $statusArrival = 'on_time';
            $lateMinutes = 0;

            // Bandingkan Waktu Sekarang vs Jam 08:00
            if ($now->greaterThan($officeStartTime)) {
                $statusArrival = 'late';
                // Hitung selisih menit (pembulatan ke atas)
                $lateMinutes = ceil($now->diffInMinutes($officeStartTime));
            }
            // ----------------------------------

            Attendance::create([
                'user_id' => Auth::id(),
                'date' => $todayDate, 
                'clock_in' => $now, 
                'latitude_in' => $request->latitude,
                'longitude_in' => $request->longitude,
                'status' => 'present',
                'status_arrival' => $statusArrival,
                'late_minutes' => $lateMinutes,
            ]);

            $msg = $statusArrival === 'late' 
                ? "Absen Masuk Berhasil. Anda terlambat {$lateMinutes} menit." 
                : "Absen Masuk Berhasil. Tepat waktu!";

            return redirect()->back()->with('success', $msg);

        } else { // Clock Out
            
            $attendance = Attendance::where('user_id', Auth::id())
                ->whereDate('date', $todayDate)
                ->first();
            
            if (!$attendance) {
                return redirect()->back()->with('error', 'Anda belum absen masuk!');
            }

            $attendance->update([
                'clock_out' => $now,
                'latitude_out' => $request->latitude,
                'longitude_out' => $request->longitude,
            ]);

            return redirect()->back()->with('success', 'Absen Pulang berhasil dicatat.');
        }
    }

    // Fungsi Haversine untuk hitung jarak (meter)
    private function calculateDistance($lat1, $lon1, $lat2, $lon2) {
        $earthRadius = 6371000; // meter
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return round($earthRadius * $c);
    }
}