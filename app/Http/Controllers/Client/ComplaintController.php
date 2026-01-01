<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use App\Models\ActivityLog; // [WAJIB IMPORT] Agar tercatat di Audit
use App\Notifications\SystemAlert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    public function index(Request $request)
    {
        // [KEAMANAN] Anti-IDOR: Hanya ambil task milik user yang sedang login
        $query = Task::with('technician')
            ->where('client_user_id', Auth::id())
            ->where('type', 'repair'); // Menggunakan Task 'repair' sebagai Complaint

        // Fitur Pencarian
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
                'status' => $task->status, // pending, assigned, in_progress, completed
                'technician_name' => $task->technician ? $task->technician->name : 'Belum ditugaskan',
                'created_at' => $task->created_at->translatedFormat('d M Y H:i'),
            ]);

        return Inertia::render('Client/Complaints/Index', [
            'complaints' => $complaints,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validasi
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|min:10',
        ], [
            'description.required' => 'Mohon jelaskan detail masalah agar teknisi mudah memperbaiki.',
            'description.min' => 'Deskripsi terlalu singkat (minimal 10 karakter).',
        ]);

        // 2. Simpan ke Database
        $task = Task::create([
            'client_user_id' => Auth::id(), // [KEAMANAN] Paksa ID User Login
            'title' => $request->title,
            'description' => $request->description,
            'type' => 'repair',     // Menandakan ini adalah Keluhan/Perbaikan
            'status' => 'pending',  // Status awal
        ]);

        // 3. [FIX] Catat Log Aktivitas Client (Audit Trail)
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'client_complaint',
            'event' => 'create',
            'description' => "Membuat laporan gangguan: " . $request->title,
            'ip_address' => $request->ip(),
        ]);

        // 4. Notifikasi ke Admin (Dengan Try-Catch)
        try {
            $admins = User::where('role', 'administrator')->get();
            
            // Pastikan class SystemAlert ada
            if (class_exists(SystemAlert::class)) {
                Notification::send($admins, new SystemAlert(
                    'Aduan Baru: ' . $request->title,
                    route('admin.tasks.index'), // Admin mengecek di menu Task Management
                    'task' // Icon tipe task
                ));
            }
        } catch (\Exception $e) {
            // Silent fail untuk notifikasi, log error di server
            Log::error('Gagal mengirim notifikasi aduan: ' . $e->getMessage());
        }

        return Redirect::route('client.complaints.index')
            ->with('success', 'Laporan gangguan berhasil dikirim. Teknisi akan segera merespons.');
    }
}