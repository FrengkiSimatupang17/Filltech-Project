<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index()
    {
        $logs = Activity::with('causer')
            ->orderBy('created_at', 'desc')
            ->paginate(25);

        return Inertia::render('Admin/ActivityLog/Index', [
            'logs' => $logs,
        ]);
    }
}