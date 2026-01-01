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
        // 1. Tambahkan Validasi Khusus untuk Alamat
        $request->validate([
            'alamat' => ['required', 'string', 'max:255'],
            'rt' => ['required', 'string', 'size:3'], // Wajib 3 karakter (angka)
            'rw' => ['required', 'string', 'max:10'], // RW bebas (text/angka)
            'blok' => ['required', 'string', 'max:10'],
            'nomor_rumah' => ['required', 'string', 'max:10'],
        ]);

        $user = $request->user();
        
        // Ambil data yang divalidasi dari ProfileUpdateRequest (Name, Email) & Request di atas
        $data = $request->except(['password', 'password_confirmation']);
        $user->fill($data);

        // 2. Handle Password jika diisi
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        // 3. Logic ID UNIK (Hanya jika belum punya)
        if (!$user->id_unik && $request->rt && $request->rw && $request->blok && $request->nomor_rumah) {
            $datePrefix = now()->format('Ymd');
            
            // RT: Dipaksa 3 digit (contoh: 1 -> 001)
            $rt = str_pad($request->rt, 3, '0', STR_PAD_LEFT);
            
            // RW: Text Bebas, hanya di-uppercase (contoh: 05A tetap 05A)
            $rw = strtoupper($request->rw); 
            
            $blok = strtoupper($request->blok);
            $nomorRumah = strtoupper($request->nomor_rumah);
            
            $user->id_unik = "{$datePrefix}_{$rt}_{$rw}_{$blok}{$nomorRumah}";
        }
        
        // 4. Reset verifikasi email jika email berubah
        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $user->save();

        // Redirect kembali ke halaman edit dengan pesan sukses
        return Redirect::route('profile.edit')->with('success', 'Profil berhasil diperbarui!');
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