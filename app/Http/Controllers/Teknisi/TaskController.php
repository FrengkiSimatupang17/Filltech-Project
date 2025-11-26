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
    public function index(Request $request)
    {
        $query = Task::with('client')
            ->where('technician_user_id', Auth::id());

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhereHas('client', function ($sq) use ($request) {
                      $sq->where('name', 'like', '%' . $request->search . '%')
                         ->orWhere('nomor_rumah', 'like', '%' . $request->search . '%');
                  });
            });
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $tasks = $query->orderByRaw("CASE WHEN status = 'assigned' THEN 1 WHEN status = 'in_progress' THEN 2 ELSE 3 END")
            ->orderBy('updated_at', 'desc')
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($task) => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'type' => $task->type,
                'status' => $task->status,
                'client_name' => $task->client ? $task->client->name : 'Klien Dihapus',
                'client_address' => $task->client ? "Blok {$task->client->blok} No. {$task->client->nomor_rumah}" : '-',
                'client_phone' => $task->client ? $task->client->phone_number : '-',
                'created_at' => $task->created_at->translatedFormat('d M Y'),
            ]);

        return Inertia::render('Teknisi/Tasks/Index', [
            'tasks' => $tasks,
            'filters' => $request->only(['search', 'status']),
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

        return Redirect::route('teknisi.tasks.index')->with('success', 'Status tugas berhasil diperbarui.');
    }
}