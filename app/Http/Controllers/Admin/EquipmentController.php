<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Models\EquipmentLog;
use App\Models\ActivityLog; // [WAJIB IMPORT]
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // [WAJIB IMPORT]
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EquipmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Equipment::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $equipment = $query->orderBy('category', 'desc')
                           ->orderBy('name')
                           ->paginate(10)
                           ->withQueryString();

        return Inertia::render('Admin/Equipment/Index', [
            'equipment' => $equipment,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:tool,material',
            'total_quantity' => 'required|integer|min:0',
            'unit' => 'required|string',
        ]);

        $equipment = Equipment::create([
            'name' => $request->name,
            'category' => $request->category,
            'total_quantity' => $request->total_quantity,
            'available_quantity' => $request->total_quantity,
            'unit' => $request->unit,
            'status' => 'available',
        ]);

        // [FIX] Catat Log Admin
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'create_equipment',
            'event' => 'create',
            'description' => 'Menambahkan alat/bahan baru: ' . $request->name,
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', 'Barang berhasil ditambahkan.');
    }

    public function update(Request $request, Equipment $equipment)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:tool,material',
            'total_quantity' => 'required|integer|min:0',
            'unit' => 'required|string',
        ]);

        $diff = $request->total_quantity - $equipment->total_quantity;
        
        $equipment->update([
            'name' => $request->name,
            'category' => $request->category,
            'total_quantity' => $request->total_quantity,
            'available_quantity' => $equipment->available_quantity + $diff,
            'unit' => $request->unit,
        ]);

        // [FIX] Catat Log Admin
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'update_equipment',
            'event' => 'update',
            'description' => 'Mengupdate data barang: ' . $equipment->name,
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', 'Data barang diperbarui.');
    }

    public function destroy(Equipment $equipment)
    {
        $name = $equipment->name;
        $equipment->delete();

        // [FIX] Catat Log Admin
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'delete_equipment',
            'event' => 'delete',
            'description' => 'Menghapus barang: ' . $name,
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'Barang dihapus.');
    }

    // [METODE RESTOCK] - Penting agar fitur restock di frontend & routes berfungsi
    public function restock(Request $request, Equipment $equipment)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            // 1. Tambah Stok
            $equipment->increment('total_quantity', $request->quantity);
            $equipment->increment('available_quantity', $request->quantity);

            // 2. Log History Barang (Table: equipment_logs)
            EquipmentLog::create([
                'equipment_id' => $equipment->id,
                'user_id' => Auth::id(),
                'type' => 'restock',
                'quantity' => $request->quantity,
                'notes' => $request->notes ?? 'Restock via Admin',
            ]);

            // 3. [FIX] Log Aktivitas Admin (Table: activity_logs)
            ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'restock_equipment',
                'event' => 'update',
                'description' => "Restock {$request->quantity} {$equipment->unit} - {$equipment->name}",
                'ip_address' => $request->ip(),
            ]);

            DB::commit();
            return redirect()->back()->with('success', 'Stok berhasil ditambahkan.');

        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->withErrors(['error' => 'Gagal restock: ' . $e->getMessage()]);
        }
    }
}