<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class TechnicianManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Technicians/Index', [
            'users' => User::where('role', 'teknisi')->orderBy('name')->get()->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::min(8)],
            'phone_number' => 'nullable|string|max:20',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'teknisi',
            'phone_number' => $request->phone_number,
        ]);

        return Redirect::route('admin.technicians.index')->with('success', 'Teknisi baru berhasil ditambahkan!');
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'confirmed', Password::min(8)],
            'phone_number' => 'nullable|string|max:20',
        ]);
        
        $user->fill($request->except('password'));

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return Redirect::route('admin.technicians.index')->with('success', 'Data teknisi berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return Redirect::route('admin.technicians.index')->with('success', 'Akun teknisi berhasil dihapus.');
    }
}