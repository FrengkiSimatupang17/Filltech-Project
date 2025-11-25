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

class ClientManagementController extends Controller
{
    public function index()
    {
        $users = User::where('role', 'client')
            ->orderBy('name')
            ->paginate(10)
            ->through(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'id_unik' => $user->id_unik,
                'phone_number' => $user->phone_number,
                'rt' => $user->rt,
                'rw' => $user->rw,
                'blok' => $user->blok,
                'nomor_rumah' => $user->nomor_rumah,
            ]);

        return Inertia::render('Admin/Clients/Index', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::min(8)],
            'id_unik' => 'nullable|string|max:100|unique:users',
            'phone_number' => 'nullable|string|max:20',
            'rt' => ['nullable', 'string', 'max:3'],
            'rw' => ['nullable', 'string', 'max:3'],
            'blok' => ['nullable', 'string', 'max:10'],
            'nomor_rumah' => ['nullable', 'string', 'max:10'],
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'client',
            'id_unik' => $request->id_unik,
            'phone_number' => $request->phone_number,
            'rt' => $request->rt,
            'rw' => $request->rw,
            'blok' => $request->blok,
            'nomor_rumah' => $request->nomor_rumah,
        ]);

        return Redirect::route('admin.clients.index')->with('success', 'Klien baru berhasil ditambahkan!');
    }
    
    public function update(Request $request, User $client)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($client->id)],
            'password' => ['nullable', 'confirmed', Password::min(8)],
            'id_unik' => ['nullable', 'string', 'max:100', Rule::unique('users')->ignore($client->id)],
            'phone_number' => 'nullable|string|max:20',
            'rt' => ['nullable', 'string', 'max:3'],
            'rw' => ['nullable', 'string', 'max:3'],
            'blok' => ['nullable', 'string', 'max:10'],
            'nomor_rumah' => ['nullable', 'string', 'max:10'],
        ]);

        $client->fill($request->except('password'));

        if ($request->filled('password')) {
            $client->password = Hash::make($request->password);
        }

        $client->save();

        return Redirect::route('admin.clients.index')->with('success', 'Data klien berhasil diperbarui.');
    }

    public function destroy(User $client)
    {
        $client->delete();

        return Redirect::route('admin.clients.index')->with('success', 'Akun klien berhasil dihapus.');
    }
}