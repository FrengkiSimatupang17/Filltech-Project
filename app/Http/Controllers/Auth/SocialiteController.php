<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class SocialiteController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            // 1. Cari User berdasarkan Email
            $user = User::where('email', $googleUser->email)->first();

            if ($user) {
                // --- SKENARIO LOGIN (User Lama) ---
                $user->forceFill([
                    'email_verified_at' => $user->email_verified_at ?? now(),
                ])->save();
                
            } else {
                // --- SKENARIO REGISTER (User Baru) ---
                $userData = [
                    'name'              => $googleUser->name,
                    'email'             => $googleUser->email,
                    'password'          => bcrypt(Str::random(24)),
                    'role'              => 'client',
                    'email_verified_at' => now(),
                    
                    // ID Unik akan diurus otomatis oleh Model User (booted)
                    
                    // Data Dummy (Tanda '-' menandakan data belum diisi)
                    // Kita akan gunakan tanda ini untuk mendeteksi user baru
                    'phone_number'      => '-', 
                    'alamat'            => '-', 
                    'rt'                => '-',
                    'rw'                => '-',
                    'blok'              => '-',
                    'nomor_rumah'       => '-',
                ];

                $user = User::create($userData);
            }

            // 2. Login User
            Auth::login($user);

            // --- [LOGIKA BARU] CEK KELENGKAPAN DATA ---
            // Jika alamat atau no hp masih '-', berarti ini user baru / belum lengkap
            // Maka paksa redirect ke halaman Edit Profile
            if ($user->alamat === '-' || $user->phone_number === '-') {
                return redirect()->route('profile.edit')
                    ->with('message', 'Halo! Silakan lengkapi Alamat dan Nomor WhatsApp Anda untuk melanjutkan.');
            }

            // 3. Jika data sudah lengkap, masuk Dashboard
            return redirect()->route('dashboard');

        } catch (\Exception $e) {
            dd([
                'Pesan Error' => $e->getMessage(),
                'Lokasi' => $e->getFile() . ' baris ' . $e->getLine()
            ]);
        }
    }
}