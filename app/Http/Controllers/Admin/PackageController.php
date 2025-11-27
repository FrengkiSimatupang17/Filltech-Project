<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PackageRequest;
use App\Models\Package;
use Illuminate\Http\Request;
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
        Package::create($request->validated());

        return Redirect::route('admin.packages.index')->with('success', 'Paket berhasil ditambahkan!');
    }

    public function update(PackageRequest $request, Package $package)
    {
        $package->update($request->validated());

        return Redirect::route('admin.packages.index')->with('success', 'Paket berhasil diperbarui.');
    }

    public function destroy(Package $package)
    {
        $package->delete();

        return Redirect::route('admin.packages.index')->with('success', 'Paket berhasil dihapus.');
    }
}