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
        $user = $request->user();
        
        $data = $request->except(['password', 'password_confirmation']);
        $user->fill($data);
        
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        if (!$user->id_unik && $request->rt && $request->rw && $request->blok && $request->nomor_rumah) {
            $datePrefix = now()->format('Ymd');
            $rt = str_pad($request->rt, 3, '0', STR_PAD_LEFT);
            $rw = str_pad($request->rw, 3, '0', STR_PAD_LEFT);
            $blok = strtoupper($request->blok);
            $nomorRumah = strtoupper($request->nomor_rumah);
            
            $user->id_unik = "{$datePrefix}_{$rt}_{$rw}_{$blok}{$nomorRumah}";
        }
        
        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('dashboard')->with('success', 'Profil berhasil diperbarui!');
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