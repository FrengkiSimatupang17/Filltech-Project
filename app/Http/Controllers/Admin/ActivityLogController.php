<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index()
    {
        $logs = Activity::with('causer')
            ->latest()
            ->paginate(15)
            ->through(fn ($activity) => [
                'id' => $activity->id,
                'description' => $activity->description,
                'causer_name' => $activity->causer ? $activity->causer->name : 'System',
                'created_at' => $activity->created_at->translatedFormat('d M Y, H:i:s'),
            ]);

        return Inertia::render('Admin/ActivityLog/Index', [
            'logs' => $logs,
        ]);
    }
}