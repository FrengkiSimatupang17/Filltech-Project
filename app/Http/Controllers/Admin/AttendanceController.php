<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Attendance;
use App\Models\User;
use Maatwebsite\Excel\Facades\Excel; // Pastikan package ini terinstall
use App\Exports\AttendanceExport;    // Class Export yang sudah dibuat sebelumnya

class AttendanceController extends Controller
{
    /**
     * Menampilkan halaman Laporan Absensi dengan Filter
     */
    public function index(Request $request)
    {
        // 1. Query Dasar (Eager Load 'user' agar nama teknisi muncul)
        // Kita urutkan dari yang terbaru (created_at desc)
        $query = Attendance::with('user');

        // 2. Filter Tanggal (Range)
        if ($request->filled('start_date') && $request->filled('end_date')) {
            // Menggunakan whereDate agar format YYYY-MM-DD cocok dengan created_at atau kolom date
            // Jika Anda menggunakan kolom 'date', ganti 'created_at' menjadi 'date'
            $query->whereBetween('created_at', [
                $request->start_date . ' 00:00:00', 
                $request->end_date . ' 23:59:59'
            ]);
        }

        // 3. Filter Teknisi Spesifik
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // 4. Eksekusi Query (Pagination)
        $attendances = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString(); // Agar parameter filter tetap ada saat ganti halaman (klik page 2, filter tidak hilang)

        // 5. Ambil Daftar Teknisi untuk Dropdown Filter
        // Asumsi role teknisi tersimpan di kolom 'role' atau bisa disesuaikan
        $technicians = User::where('role', 'teknisi')
            ->orderBy('name')
            ->get(['id', 'name']);

        // 6. Return ke View Inertia
        return Inertia::render('Admin/Attendance/Index', [
            'attendances' => $attendances,
            'technicians' => $technicians,
            'filters' => $request->only(['start_date', 'end_date', 'user_id']),
        ]);
    }

    /**
     * Export Laporan ke Excel
     */
    public function export(Request $request)
    {
        // Generate nama file unik dengan timestamp
        $fileName = 'Laporan_Absensi_Teknisi_' . date('d-m-Y_H-i') . '.xlsx';

        // Panggil Class Export
        return Excel::download(new AttendanceExport(
            $request->start_date,
            $request->end_date,
            $request->user_id
        ), $fileName);
    }
}