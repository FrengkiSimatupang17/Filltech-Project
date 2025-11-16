<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
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
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        if (!$user->id_unik && $request->filled('rt') && $request->filled('rw') && $request->filled('blok') && $request->filled('nomor_rumah')) {
            $user->id_unik = $this->generateUniqueId($request);
        }

        $user->save();

        return Redirect::route('profile.edit');
    }

    private function generateUniqueId(ProfileUpdateRequest $request): string
    {
        $date = now()->format('Ymd');
        $rt = str_pad($request->rt, 3, '0', STR_PAD_LEFT);
        $rw = str_pad($request->rw, 3, '0', STR_PAD_LEFT);
        $blok = $request->blok;
        $nomor = $request->nomor_rumah;

        return "{$date}_{$rt}_{$rw}_{$blok}{$nomor}";
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