<?php

namespace App\Http\Controllers\Teknisi;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::with('clientUser')
            ->where('technician_user_id', Auth::id())
            ->orderByRaw("CASE WHEN status = 'assigned' THEN 1 WHEN status = 'in_progress' THEN 2 ELSE 3 END")
            ->orderBy('updated_at', 'desc')
            ->get();

        return Inertia::render('Teknisi/Tasks/Index', [
            'tasks' => $tasks->map(fn ($task) => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'type' => $task->type,
                'status' => $task->status,
                'client_name' => $task->clientUser?->name,
                'client_address' => $task->clientUser?->address_detail,
                'client_phone' => $task->clientUser?->phone_number,
                'created_at' => $task->created_at->format('d M Y'),
            ]),
        ]);
    }

    public function update(Request $request, Task $task)
    {
        if ($task->technician_user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'status' => ['required', Rule::in(['in_progress', 'completed'])],
        ]);

        $taskData = ['status' => $request->status];

        if ($request->status === 'completed') {
            $taskData['completed_at'] = now();
        }

        $task->update($taskData);

        return Redirect::route('teknisi.tasks.index');
    }
}