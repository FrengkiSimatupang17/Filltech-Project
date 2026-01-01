<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = ActivityLog::with('user');

        // 1. Filter Tanggal
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('created_at', [
                $request->start_date . ' 00:00:00', 
                $request->end_date . ' 23:59:59'
            ]);
        }

        // 2. Filter Role User
        if ($request->filled('role')) {
            $query->whereHas('user', function($q) use ($request) {
                $q->where('role', $request->role);
            });
        }

        // 3. Filter Search (Nama/Deskripsi)
        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->whereHas('user', function($subQ) use ($request) {
                    $subQ->where('name', 'like', "%{$request->search}%");
                })
                ->orWhere('description', 'like', "%{$request->search}%")
                ->orWhere('action', 'like', "%{$request->search}%");
            });
        }

        $logs = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Admin/ActivityLogs/Index', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'start_date', 'end_date', 'role'])
        ]);
    }
}