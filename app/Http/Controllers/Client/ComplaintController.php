<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use App\Notifications\SystemAlert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::with('technician')
            ->where('client_user_id', Auth::id())
            ->where('type', 'repair');

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $complaints = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($task) => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'technician_name' => $task->technician ? $task->technician->name : null,
                'created_at' => $task->created_at->translatedFormat('d M Y'),
            ]);

        return Inertia::render('Client/Complaints/Index', [
            'complaints' => $complaints,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Task::create([
            'client_user_id' => Auth::id(),
            'title' => $request->title,
            'description' => $request->description,
            'type' => 'repair',
            'status' => 'pending',
        ]);

        $admins = User::where('role', 'administrator')->get();
        Notification::send($admins, new SystemAlert(
            'Aduan Baru: ' . $request->title,
            route('admin.tasks.index'),
            'task'
        ));

        return Redirect::route('client.complaints.index')->with('success', 'Aduan berhasil dikirim. Teknisi akan segera merespons.');
    }
}