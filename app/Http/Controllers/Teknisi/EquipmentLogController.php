<?php

namespace App\Http\Controllers\Teknisi;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Models\EquipmentLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class EquipmentLogController extends Controller
{
    public function index(Request $request)
    {
        $teknisiId = Auth::id();
        $search = $request->search;

        $availableEquipmentQuery = Equipment::where('status', 'available');

        // Search for Available equipment (optional)
        if ($search) {
            $availableEquipmentQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('serial_number', 'like', '%' . $search . '%');
            });
        }

        $availableEquipment = $availableEquipmentQuery->orderBy('name')->get();
        
        $myBorrowedEquipment = EquipmentLog::with('equipment')
            ->where('technician_user_id', $teknisiId)
            ->whereNull('returned_at')
            ->orderBy('borrowed_at', 'desc')
            ->get()
            ->map(fn ($log) => [
                'id' => $log->id,
                'equipment_name' => $log->equipment->name,
                'serial_number' => $log->equipment->serial_number,
                'borrowed_at' => $log->borrowed_at->translatedFormat('d M Y, H:i'),
            ]);

        $myHistory = EquipmentLog::with('equipment')
            ->where('technician_user_id', $teknisiId)
            ->whereNotNull('returned_at')
            ->orderBy('borrowed_at', 'desc')
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($log) => [
                'id' => $log->id,
                'equipment_name' => $log->equipment->name,
                'serial_number' => $log->equipment->serial_number,
                'borrowed_at' => $log->borrowed_at->translatedFormat('d M Y, H:i'),
                'returned_at' => $log->returned_at->translatedFormat('d M Y, H:i'),
            ]);

        return Inertia::render('Teknisi/Equipment/Index', [
            'availableEquipment' => $availableEquipment,
            'myBorrowedEquipment' => $myBorrowedEquipment,
            'myHistory' => $myHistory,
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'equipment_id' => 'required|exists:equipment,id',
        ]);

        $teknisiId = Auth::id();
        $equipmentId = $request->equipment_id;

        $response = DB::transaction(function () use ($teknisiId, $equipmentId) {
            $equipment = Equipment::where('id', $equipmentId)->where('status', 'available')->lockForUpdate()->first();

            if (!$equipment) {
                return ['error' => 'Alat tidak tersedia atau sudah dipinjam.'];
            }

            EquipmentLog::create([
                'technician_user_id' => $teknisiId,
                'equipment_id' => $equipmentId,
                'borrowed_at' => now(),
            ]);

            $equipment->update(['status' => 'in_use']);
            return ['success' => 'Peminjaman alat berhasil dicatat.'];
        });

        if (isset($response['error'])) {
            return Redirect::back()->with('error', $response['error']);
        }

        return Redirect::route('teknisi.equipment.index')->with('success', $response['success']);
    }

    public function update(Request $request, EquipmentLog $equipmentLog)
    {
        if ($equipmentLog->technician_user_id !== Auth::id() || $equipmentLog->returned_at) {
            abort(403);
        }

        $response = DB::transaction(function () use ($equipmentLog) {
            $equipmentLog->update(['returned_at' => now()]);

            $equipment = $equipmentLog->equipment;
            if ($equipment->status === 'in_use') {
                $equipment->update(['status' => 'available']);
            }
            return ['success' => 'Pengembalian alat berhasil dicatat.'];
        });

        return Redirect::route('teknisi.equipment.index')->with('success', $response['success']);
    }
}