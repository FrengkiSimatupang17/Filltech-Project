<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Attendance;
use Symfony\Component\HttpFoundation\Response;

class RequireClockIn
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Hanya cek jika user adalah Teknisi
        if ($user && $user->role === 'teknisi') {
            
            // Cek apakah sudah ada record clock_in hari ini dan belum clock_out
            $attendance = Attendance::where('technician_user_id', $user->id)
                ->whereDate('clock_in', now()) // Cek tanggal hari ini
                ->whereNull('clock_out') // Pastikan belum clock-out (masih kerja)
                ->first();

            if (!$attendance) {
                // Jika belum absen, paksa redirect ke halaman absensi dengan pesan error
                if (! $request->routeIs('teknisi.attendance.*')) {
                    return redirect()->route('teknisi.attendance.index')
                        ->with('error', 'Akses Ditolak: Anda wajib melakukan Clock-In di kantor sebelum melihat tugas.');
                }
            }
        }

        return $next($request);
    }
}