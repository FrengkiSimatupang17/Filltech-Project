<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog; // [WAJIB IMPORT] Agar tercatat di Log Admin
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth; // [WAJIB IMPORT] Untuk ID Admin
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class TechnicianManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'teknisi');

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('id_unik', 'like', '%' . $request->search . '%');
            });
        }

        $users = $query->orderBy('name')
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'id_unik' => $user->id_unik,
                'phone_number' => $user->phone_number,
                'created_at' => $user->created_at->translatedFormat('d M Y'),
            ]);

        return Inertia::render('Admin/Technicians/Index', [
            'users' => $users,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::min(8)],
            'id_unik' => 'required|string|max:100|unique:users',
            'phone_number' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'teknisi',
            'id_unik' => $request->id_unik,
            'phone_number' => $request->phone_number,
        ]);

        // [FIX] Catat Log Aktivitas Admin
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'create_technician',
            'event' => 'create',
            'description' => 'Mendaftarkan teknisi baru: ' . $user->name,
            'ip_address' => $request->ip(),
        ]);

        return Redirect::route('admin.technicians.index')->with('success', 'Teknisi baru berhasil ditambahkan!');
    }
    
    public function update(Request $request, User $technician)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($technician->id)],
            'password' => ['nullable', 'confirmed', Password::min(8)],
            'id_unik' => ['required', 'string', 'max:100', Rule::unique('users')->ignore($technician->id)],
            'phone_number' => 'nullable|string|max:20',
        ]);

        $technician->fill($request->except('password'));

        if ($request->filled('password')) {
            $technician->password = Hash::make($request->password);
        }

        $technician->save();

        // [FIX] Catat Log Aktivitas Admin
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'update_technician',
            'event' => 'update',
            'description' => 'Memperbarui data teknisi: ' . $technician->name,
            'ip_address' => $request->ip(),
        ]);

        return Redirect::route('admin.technicians.index')->with('success', 'Data teknisi berhasil diperbarui.');
    }

    public function destroy(User $technician)
    {
        $name = $technician->name; // Simpan nama sebelum dihapus
        
        $technician->delete();

        // [FIX] Catat Log Aktivitas Admin
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'delete_technician',
            'event' => 'delete',
            'description' => 'Menghapus akun teknisi: ' . $name,
            'ip_address' => request()->ip(),
        ]);

        return Redirect::route('admin.technicians.index')->with('success', 'Akun teknisi berhasil dihapus.');
    }
}