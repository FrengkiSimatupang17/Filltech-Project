<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PackageRequest;
use App\Models\Package;
use App\Models\ActivityLog; // [WAJIB IMPORT]
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // [WAJIB IMPORT]
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class PackageController extends Controller
{
    public function index(Request $request)
    {
        $query = Package::query();

        if ($request->has('search')) {
            $search = strip_tags($request->search);
            
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('speed', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        $packages = $query->orderBy('price', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Packages/Index', [
            'packages' => $packages,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(PackageRequest $request)
    {
        // 1. Simpan Data Paket
        $package = Package::create($request->validated());

        // 2. [FIX] Catat Log Aktivitas (Sesuai kolom di Database Anda)
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'create_package',
            'event' => 'create', 
            'description' => 'Menambahkan paket baru: ' . $package->name,
            'ip_address' => $request->ip(),
        ]);

        return Redirect::route('admin.packages.index')->with('success', 'Paket berhasil ditambahkan!');
    }

    public function update(PackageRequest $request, Package $package)
    {
        // 1. Update Data Paket
        $package->update($request->validated());

        // 2. [FIX] Catat Log Aktivitas
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'update_package',
            'event' => 'update',
            'description' => 'Memperbarui data paket: ' . $package->name,
            'ip_address' => $request->ip(),
        ]);

        return Redirect::route('admin.packages.index')->with('success', 'Paket berhasil diperbarui.');
    }

    public function destroy(Package $package)
    {
        $name = $package->name; // Simpan nama untuk log

        // 1. Hapus Data Paket
        $package->delete();

        // 2. [FIX] Catat Log Aktivitas
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'delete_package',
            'event' => 'delete',
            'description' => 'Menghapus paket: ' . $name,
            'ip_address' => request()->ip(),
        ]);

        return Redirect::route('admin.packages.index')->with('success', 'Paket berhasil dihapus.');
    }
}