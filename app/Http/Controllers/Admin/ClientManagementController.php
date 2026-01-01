<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog; // [WAJIB IMPORT]
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth; // [WAJIB IMPORT]
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ClientManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'client');

        // 1. Filter Search (Existing)
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('id_unik', 'like', '%' . $request->search . '%');
            });
        }

        // 2. [BARU] Filter RT
        if ($request->filled('rt')) {
            $query->where('rt', $request->rt);
        }

        // 3. [BARU] Filter RW
        if ($request->filled('rw')) {
            $query->where('rw', $request->rw);
        }

        $users = $query->orderBy('name')
            ->paginate(10)
            ->withQueryString() // Penting agar filter tidak hilang saat pindah halaman
            ->through(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'id_unik' => $user->id_unik,
                'phone_number' => $user->phone_number,
                'address_full' => $user->address_detail, // Pastikan Accessor ini ada di Model User
                'rt' => $user->rt,
                'rw' => $user->rw,
                'blok' => $user->blok,
                'nomor_rumah' => $user->nomor_rumah,
            ]);

        // 4. [BARU] Ambil Data RT dan RW Unik untuk Dropdown Frontend
        $availableRt = User::where('role', 'client')
            ->whereNotNull('rt')
            ->where('rt', '!=', '-')
            ->distinct()
            ->orderBy('rt')
            ->pluck('rt');

        $availableRw = User::where('role', 'client')
            ->whereNotNull('rw')
            ->where('rw', '!=', '-')
            ->distinct()
            ->orderBy('rw')
            ->pluck('rw');

        return Inertia::render('Admin/Clients/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'rt', 'rw']),
            'availableRt' => $availableRt,
            'availableRw' => $availableRw,
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
            'alamat' => 'nullable|string|max:500',
            'rt' => ['nullable', 'string', 'max:20'], // Max 20 sesuai request
            'rw' => ['nullable', 'string', 'max:20'],
            'blok' => ['nullable', 'string', 'max:10'],
            'nomor_rumah' => ['nullable', 'string', 'max:10'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'client',
            'id_unik' => $request->id_unik,
            'phone_number' => $request->phone_number,
            'alamat' => $request->alamat,
            'rt' => $request->rt,
            'rw' => $request->rw,
            'blok' => $request->blok,
            'nomor_rumah' => $request->nomor_rumah,
        ]);

        // [FIX] Catat Log Aktivitas Admin
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'create_client',
            'event' => 'create',
            'description' => 'Mendaftarkan pelanggan baru: ' . $user->name,
            'ip_address' => $request->ip(),
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
            'alamat' => 'nullable|string|max:500',
            'rt' => ['nullable', 'string', 'max:20'], // Max 20 sesuai request
            'rw' => ['nullable', 'string', 'max:20'],
            'blok' => ['nullable', 'string', 'max:10'],
            'nomor_rumah' => ['nullable', 'string', 'max:10'],
        ]);

        $client->fill($request->except('password'));

        if ($request->filled('password')) {
            $client->password = Hash::make($request->password);
        }

        $client->save();

        // [FIX] Catat Log Aktivitas Admin
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'update_client',
            'event' => 'update',
            'description' => 'Memperbarui data pelanggan: ' . $client->name,
            'ip_address' => $request->ip(),
        ]);

        return Redirect::route('admin.clients.index')->with('success', 'Data klien berhasil diperbarui.');
    }

    public function destroy(User $client)
    {
        $name = $client->name; // Simpan nama sebelum dihapus
        $client->delete();

        // [FIX] Catat Log Aktivitas Admin
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'delete_client',
            'event' => 'delete',
            'description' => 'Menghapus akun pelanggan: ' . $name,
            'ip_address' => request()->ip(),
        ]);

        return Redirect::route('admin.clients.index')->with('success', 'Akun klien berhasil dihapus.');
    }
}