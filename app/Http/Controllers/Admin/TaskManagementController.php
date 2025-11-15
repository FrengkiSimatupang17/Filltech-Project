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
    public function index()
    {
        $tasks = Task::with(['clientUser', 'technicianUser'])
            ->orderByRaw("CASE WHEN status = 'pending' THEN 1 WHEN status = 'assigned' THEN 2 ELSE 3 END")
            ->orderBy('created_at', 'desc')
            ->get();

        $teknisi = User::where('role', 'teknisi')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Tasks/Index', [
            'tasks' => $tasks->map(fn ($task) => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'type' => $task->type,
                'status' => $task->status,
                'client_name' => $task->clientUser?->name,
                'technician_name' => $task->technicianUser?->name,
                'created_at' => $task->created_at->format('d M Y'),
            ]),
            'teknisi' => $teknisi,
        ]);
    }

    public function update(Request $request, Task $task)
    {
        $request->validate([
            'technician_user_id' => 'required|exists:users,id',
        ]);

        $teknisi = User::find($request->technician_user_id);
        if ($teknisi->role !== 'teknisi') {
            return Redirect::back()->with('error', 'User yang dipilih bukan teknisi.');
        }

        $task->update([
            'technician_user_id' => $request->technician_user_id,
            'status' => 'assigned',
        ]);

        return Redirect::route('admin.tasks.index');
    }
}