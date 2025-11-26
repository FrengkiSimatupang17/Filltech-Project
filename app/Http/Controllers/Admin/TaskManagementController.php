<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class TaskManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::with(['client', 'technician']);

        // Filter Status (Pending, In Progress, Completed)
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search by Title or Client Name
        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhereHas('client', function($sq) use ($request) {
                      $sq->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        $tasks = $query->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($task) => [
                'id' => $task->id,
                'title' => $task->title,
                'type' => $task->type, // installation / repair
                'status' => $task->status,
                'client_name' => $task->client ? $task->client->name : 'Unknown Client',
                'technician_name' => $task->technician ? $task->technician->name : null,
                'created_at' => $task->created_at->translatedFormat('d M Y'),
            ]);

        // Ambil daftar teknisi untuk dropdown di modal assignment
        $technicians = User::where('role', 'teknisi')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Tasks/Index', [
            'tasks' => $tasks,
            'teknisi' => $technicians,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function update(Request $request, Task $task)
    {
        // Fitur Assign Teknisi
        if ($request->has('technician_user_id')) {
            $request->validate([
                'technician_user_id' => 'required|exists:users,id',
            ]);

            $task->update([
                'technician_user_id' => $request->technician_user_id,
                'status' => 'assigned', // Otomatis ubah status jadi assigned
            ]);

            return Redirect::back()->with('success', 'Tugas berhasil ditugaskan ke teknisi.');
        }

        return Redirect::back();
    }
}