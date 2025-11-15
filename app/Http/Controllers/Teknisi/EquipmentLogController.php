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
    public function index()
    {
        $teknisiId = Auth::id();

        $availableEquipment = Equipment::where('status', 'available')->orderBy('name')->get();
        
        $myBorrowedEquipment = EquipmentLog::with('equipment')
            ->where('technician_user_id', $teknisiId)
            ->whereNull('returned_at')
            ->orderBy('borrowed_at', 'desc')
            ->get();

        $myHistory = EquipmentLog::with('equipment')
            ->where('technician_user_id', $teknisiId)
            ->whereNotNull('returned_at')
            ->orderBy('borrowed_at', 'desc')
            ->paginate(10);

        return Inertia::render('Teknisi/Equipment/Index', [
            'availableEquipment' => $availableEquipment,
            'myBorrowedEquipment' => $myBorrowedEquipment,
            'myHistory' => $myHistory,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'equipment_id' => 'required|exists:equipment,id',
        ]);

        $teknisiId = Auth::id();
        $equipmentId = $request->equipment_id;

        DB::transaction(function () use ($teknisiId, $equipmentId) {
            $equipment = Equipment::where('id', $equipmentId)->where('status', 'available')->lockForUpdate()->first();

            if (!$equipment) {
                return Redirect::back()->with('error', 'Alat tidak tersedia atau sudah dipinjam.');
            }

            EquipmentLog::create([
                'technician_user_id' => $teknisiId,
                'equipment_id' => $equipmentId,
                'borrowed_at' => now(),
            ]);

            $equipment->update(['status' => 'in_use']);
        });

        return Redirect::route('teknisi.equipment.index');
    }

    public function update(Request $request, EquipmentLog $equipmentLog)
    {
        if ($equipmentLog->technician_user_id !== Auth::id() || $equipmentLog->returned_at) {
            abort(403);
        }

        DB::transaction(function () use ($equipmentLog) {
            $equipmentLog->update(['returned_at' => now()]);

            $equipment = $equipmentLog->equipment;
            if ($equipment->status === 'in_use') {
                $equipment->update(['status' => 'available']);
            }
        });

        return Redirect::route('teknisi.equipment.index');
    }
}