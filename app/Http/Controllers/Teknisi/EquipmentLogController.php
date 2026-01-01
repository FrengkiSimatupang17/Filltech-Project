<?php

namespace App\Http\Controllers\Teknisi;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Models\EquipmentLog;
use App\Models\ActivityLog; // [WAJIB IMPORT] Agar tercatat di Audit Admin
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EquipmentLogController extends Controller
{
    /**
     * Menampilkan daftar alat & bahan beserta riwayat teknisi.
     */
    public function index()
    {
        // Ambil semua equipment, urutkan berdasarkan nama
        $allEquipment = Equipment::orderBy('name', 'asc')->get();

        // Hitung stok yang sedang dipegang user saat ini (Holding Qty)
        // Ini PENTING agar tombol di frontend tahu harus menampilkan "Ambil" atau "Kembalikan"
        $equipment = $allEquipment->map(function ($item) {
            $userId = Auth::id();

            // 1. Hitung total yang pernah diambil user ini
            $taken = EquipmentLog::where('equipment_id', $item->id)
                ->where('user_id', $userId)
                ->where('type', 'take') 
                ->sum('quantity');
            
            // 2. Hitung total yang sudah dikembalikan user ini
            $returned = EquipmentLog::where('equipment_id', $item->id)
                ->where('user_id', $userId)
                ->where('type', 'return')
                ->sum('quantity');

            // 3. Sisa di tangan = Total Ambil - Total Kembali
            // max(0, ...) menjaga agar tidak ada nilai minus jika ada anomali data lama
            $item->my_holding_qty = max(0, $taken - $returned);
            
            return $item;
        });
        
        // Ambil riwayat log spesifik user ini untuk tab "Riwayat Saya"
        $logs = EquipmentLog::with('equipment')
            ->where('user_id', Auth::id())
            ->latest()
            ->limit(50) // Batasi 50 agar query ringan
            ->get();

        return Inertia::render('Teknisi/Equipment/Index', [
            'equipment' => $equipment,
            'logs' => $logs
        ]);
    }

    /**
     * Memproses pengambilan atau pengembalian barang.
     */
    public function store(Request $request)
    {
        $request->validate([
            'equipment_id' => 'required|exists:equipment,id',
            'quantity' => 'required|integer|min:1',
            'type' => 'required|in:take,return',
            'notes' => 'nullable|string|max:255',
        ]);

        // Gunakan Transaksi Database untuk menjamin keamanan data (All or Nothing)
        DB::beginTransaction();

        try {
            // lockForUpdate() mencegah race condition (dua orang mengambil barang terakhir bersamaan)
            $equipment = Equipment::where('id', $request->equipment_id)->lockForUpdate()->firstOrFail();
            $qty = (int) $request->quantity;

            // --- Logic Perubahan Stok Barang ---
            if ($request->type === 'take') { 
                // Cek Stok Gudang
                if ($equipment->available_quantity < $qty) {
                    DB::rollback(); // Batalkan transaksi
                    return redirect()->back()->withErrors(['quantity' => "Stok gudang tidak cukup! Sisa: {$equipment->available_quantity}"]);
                }
                // Kurangi Stok
                $equipment->decrement('available_quantity', $qty);
            } 
            elseif ($request->type === 'return') {
                // Tambah Stok Kembali
                $equipment->increment('available_quantity', $qty);
            }

            // --- 1. Simpan Log Transaksi Barang (Untuk Tampilan Teknisi) ---
            EquipmentLog::create([
                'equipment_id' => $request->equipment_id,
                'user_id' => Auth::id(),
                'type' => $request->type,
                'quantity' => $qty,
                'notes' => $request->notes,
            ]);

            // --- 2. Simpan Activity Log (Untuk Audit Admin) ---
            // Mencatat aktivitas ini agar Admin bisa memantau siapa yang mengambil/mengembalikan barang
            $actionText = $request->type === 'take' ? 'mengambil' : 'mengembalikan';
            $categoryText = $equipment->category === 'tool' ? 'Alat' : 'Bahan';

            ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'technician_equipment_' . $request->type, 
                'event' => 'create',
                'description' => "Teknisi " . Auth::user()->name . " {$actionText} {$categoryText}: {$equipment->name} (Qty: {$qty})",
                'ip_address' => $request->ip(),
            ]);

            // Simpan perubahan permanen ke database
            DB::commit();

            return redirect()->back()->with('success', 'Transaksi berhasil disimpan.');

        } catch (\Exception $e) {
            // Jika ada error apapun, batalkan semua perubahan data
            DB::rollback();
            return redirect()->back()->withErrors(['error' => 'Gagal memproses transaksi: ' . $e->getMessage()]);
        }
    }
}