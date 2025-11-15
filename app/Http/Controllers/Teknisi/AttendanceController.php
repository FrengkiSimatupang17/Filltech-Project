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
            ->paginate(10);

        return Inertia::render('Teknisi/Attendance/Index', [
            'isClockedIn' => $isClockedIn,
            'todayAttendance' => $todayAttendance,
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

        return Redirect::route('teknisi.attendance.index');
    }
}