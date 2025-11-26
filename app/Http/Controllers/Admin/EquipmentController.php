<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EquipmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Equipment::query();

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('serial_number', 'like', '%' . $request->search . '%');
            });
        }

        return Inertia::render('Admin/Equipment/Index', [
            'equipment' => $query->orderBy('name')
                ->paginate(10)
                ->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'serial_number' => 'nullable|string|max:100|unique:equipment',
            'status' => ['required', Rule::in(['available', 'in_use', 'maintenance'])],
        ]);

        Equipment::create($request->all());

        return Redirect::route('admin.equipment.index')->with('success', 'Alat berhasil ditambahkan.');
    }

    public function update(Request $request, Equipment $equipment)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'serial_number' => ['nullable', 'string', 'max:100', Rule::unique('equipment')->ignore($equipment->id)],
            'status' => ['required', Rule::in(['available', 'in_use', 'maintenance'])],
        ]);

        $equipment->update($request->all());

        return Redirect::route('admin.equipment.index')->with('success', 'Data alat berhasil diperbarui.');
    }

    public function destroy(Equipment $equipment)
    {
        $equipment->delete();

        return Redirect::route('admin.equipment.index')->with('success', 'Alat berhasil dihapus.');
    }
}