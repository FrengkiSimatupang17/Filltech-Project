<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Attendance;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;

class RequireClockIn
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user && $user->role === 'teknisi') {
            
            // [FIX] Gunakan 'user_id' dan 'date'
            $attendance = Attendance::where('user_id', $user->id)
                ->where('date', Carbon::today()->toDateString())
                ->first();

            // Cek jika belum absen masuk (clock_in kosong)
            if (!$attendance || !$attendance->clock_in) {
                if (! $request->routeIs('teknisi.attendance.*')) {
                    return redirect()->route('dashboard')
                        ->with('error', 'Anda harus Absen Masuk terlebih dahulu.');
                }
            }
        }

        return $next($request);
    }
}