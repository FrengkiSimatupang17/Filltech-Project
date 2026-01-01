<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use App\Models\ActivityLog; // [WAJIB IMPORT]
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // [WAJIB IMPORT]
use Inertia\Inertia;
// [TAMBAHAN] Import untuk Notifikasi
use App\Notifications\SystemAlert;
use Illuminate\Support\Facades\Notification;

class TaskManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::with(['client', 'technician']);

        // 1. Filter Search
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                  ->orWhereHas('client', function($q) use ($request) {
                      $q->where('name', 'like', '%' . $request->search . '%');
                  });
        }

        // 2. Filter Status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // 3. Sorting: Pending -> Assigned -> In Progress -> Completed
        $tasks = $query->orderByRaw("CASE 
                WHEN status = 'pending' THEN 1 
                WHEN status = 'assigned' THEN 2 
                WHEN status = 'in_progress' THEN 3 
                ELSE 4 END")
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $technicians = User::where('role', 'teknisi')->get(['id', 'name']);

        return Inertia::render('Admin/Tasks/Index', [
            'tasks' => $tasks,
            'technicians' => $technicians,
            // [CRITICAL FIX] Mengirim filters ke props agar frontend tidak error
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'technician_user_id' => 'nullable|exists:users,id',
            'status' => 'required|string',
        ]);

        // Cek apakah ini penugasan baru (untuk keperluan log)
        $oldTechnicianId = $task->technician_user_id;

        // Update Data
        $task->update($validated);

        // --- [FIX] CATAT ACTIVITY LOG ADMIN ---
        $description = "Memperbarui tugas: " . $task->title;
        $action = 'update_task';

        // Deteksi jika ini adalah penugasan teknisi
        if ($request->filled('technician_user_id') && $request->technician_user_id != $oldTechnicianId) {
            $techName = $task->technician->name ?? 'Unknown';
            $description = "Menugaskan Teknisi {$techName} untuk tugas: {$task->title}";
            $action = 'assign_task';

            // [TAMBAHAN WAJIB] KIRIM NOTIFIKASI KE TEKNISI
            // Ini yang membuat notifikasi muncul di dashboard teknisi
            $newTechnician = User::find($request->technician_user_id);
            if ($newTechnician) {
                try {
                    Notification::send($newTechnician, new SystemAlert(
                        'Tugas Baru: ' . $task->title,
                        route('teknisi.tasks.index'), // Link ke halaman teknisi
                        'task'
                    ));
                } catch (\Exception $e) {
                    // Silent fail jika email error
                }
            }
        }
        // Deteksi jika hanya ganti status
        elseif ($request->filled('status')) {
            $description = "Mengubah status tugas '{$task->title}' menjadi " . strtoupper($request->status);
        }

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'event' => 'update',
            'description' => $description,
            'ip_address' => $request->ip(),
        ]);
        // ---------------------------------------

        return redirect()->back()->with('success', 'Status tugas berhasil diperbarui.');
    }
}