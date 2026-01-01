<?php

namespace App\Http\Controllers\Teknisi;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\ActivityLog; // [WAJIB] Import untuk Audit Trail
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        // Ambil tugas KHUSUS milik teknisi yang sedang login
        // Menggunakan kolom 'technician_user_id' sesuai struktur database Anda
        $tasks = Task::where('technician_user_id', Auth::id())
            ->with('client') // Pastikan relasi 'client' ada di model Task
            ->orderByRaw("CASE 
                WHEN status = 'assigned' THEN 1 
                WHEN status = 'in_progress' THEN 2 
                ELSE 3 END")
            ->latest()
            ->get();

        return Inertia::render('Teknisi/Tasks/Index', [
            'tasks' => $tasks
        ]);
    }

    public function update(Request $request, Task $task)
    {
        // 1. Keamanan: Pastikan teknisi hanya bisa update tugas miliknya
        if ($task->technician_user_id !== Auth::id()) {
            abort(403, 'Anda tidak memiliki akses ke tugas ini.');
        }

        // 2. Validasi Input
        $validated = $request->validate([
            'status' => 'required|in:in_progress,completed',
            'description' => 'nullable|string', // Menggunakan 'description' bukan 'notes'
            'evidence' => 'nullable|image|max:5120', // Foto max 5MB
        ]);

        $data = [
            'status' => $validated['status'],
        ];

        // 3. Logic Append Catatan (Menambahkan catatan baru ke deskripsi lama)
        if ($request->filled('description')) {
            $timestamp = now()->format('d/m H:i');
            $newNote = "[Update {$timestamp}]: " . $validated['description'];
            // Jika deskripsi lama ada, tambahkan baris baru. Jika tidak, langsung isi.
            $data['description'] = $task->description ? ($task->description . "\n\n" . $newNote) : $newNote;
        }

        // 4. Handle Upload Foto Bukti
        if ($request->hasFile('evidence')) {
            // Hapus foto lama jika ada (menggunakan kolom evidence_photo_path)
            if ($task->evidence_photo_path) {
                Storage::disk('public')->delete($task->evidence_photo_path);
            }
            
            $path = $request->file('evidence')->store('task-evidence', 'public');
            $data['evidence_photo_path'] = $path;
        }

        // 5. Update Data Tugas
        $task->update($data);

        // 6. [WAJIB] Simpan Activity Log untuk Admin
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'update_task',
            'event' => 'update',
            'description' => "Teknisi " . Auth::user()->name . " mengubah status tugas '{$task->title}' menjadi " . strtoupper($validated['status']),
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', 'Status tugas berhasil diperbarui.');
    }
}