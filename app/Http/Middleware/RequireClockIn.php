<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Attendance;
use Symfony\Component\HttpFoundation\Response;

class RequireClockIn
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user && $user->role === 'teknisi') {
            $attendance = Attendance::where('technician_user_id', $user->id)
                ->whereDate('clock_in', now())
                ->whereNull('clock_out')
                ->first();

            if (!$attendance) {
                return redirect()->route('teknisi.attendance.index')
                    ->with('error', 'Akses Ditolak: Anda wajib melakukan Clock-In di kantor sebelum melihat tugas.');
            }
        }

        return $next($request);
    }
}