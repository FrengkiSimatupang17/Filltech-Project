<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str; // WAJIB ADA

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        // 1. Validasi
        $request->validate([
            'alamat' => ['nullable', 'string', 'max:255'],
            'rt' => ['nullable', 'string', 'max:5'], 
            'rw' => ['nullable', 'string', 'max:50'], 
            'blok' => ['nullable', 'string', 'max:10'],
            'nomor_rumah' => ['nullable', 'string', 'max:10'],
        ]);

        $user = $request->user();
        
        $data = $request->except(['password', 'password_confirmation', 'id_unik']);
        $user->fill($data);

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        // --- LOGIKA PERBAIKAN ID (SMART FIX) ---
        
        // Cek 1: Apakah ID Kosong? (User baru daftar dengan Model User baru)
        $idKosong = empty($user->id_unik);
        
        // Cek 2: Apakah ID Cacat? (User lama yang kena bug kemarin, mengandung 'RW-' atau 'RT-' tanpa isi)
        $idCacat = Str::contains((string)$user->id_unik, 'RW-') || Str::contains((string)$user->id_unik, 'RT-');

        // Cek 3: Apakah User sudah mengisi data alamat lengkap di form sekarang?
        $alamatLengkap = $request->filled(['rt', 'rw', 'nomor_rumah']);

        // EKSEKUSI: Jika (Kosong ATAU Cacat) DAN (Alamat Lengkap) -> GENERATE!
        if ($user->role === 'client' && ($idKosong || $idCacat) && $alamatLengkap) {
            
            // Set data object user agar generator membaca data terbaru
            $user->rt = $request->rt;
            $user->rw = $request->rw;
            $user->blok = $request->blok;
            $user->nomor_rumah = $request->nomor_rumah;
            
            // Generate Ulang
            $user->id_unik = User::generateIdUnik($user);
        }
        
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit')->with('success', 'Profil diperbarui. ID Pelanggan: ' . $user->id_unik);
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();
        Auth::logout();
        $user->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}