<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class PackageController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Packages/Index', [
            'packages' => Package::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        Package::create($request->all());

        return Redirect::route('admin.packages.index');
    }

    public function update(Request $request, Package $package)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $package->update($request->all());

        return Redirect::route('admin.packages.index');
    }

    public function destroy(Package $package)
    {
        $package->delete();

        return Redirect::route('admin.packages.index');
    }
}