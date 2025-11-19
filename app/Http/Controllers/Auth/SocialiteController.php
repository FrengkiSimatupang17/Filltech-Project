<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;

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

            $user = User::where('google_id', $googleUser->getId())->first();

            if ($user) {
                Auth::login($user);
                return redirect()->route('dashboard');
            }

            $existingUser = User::where('email', $googleUser->getEmail())->first();
            if ($existingUser) {
                $existingUser->update([
                    'google_id' => $googleUser->getId(),
                    'google_avatar' => $googleUser->getAvatar(),
                ]);
                Auth::login($existingUser);
                return redirect()->route('dashboard');
            }
            
            $newUser = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'google_avatar' => $googleUser->getAvatar(),
                'password' => Hash::make(uniqid()),
                'role' => 'client',
            ]);

            Auth::login($newUser);
            return redirect()->route('profile.complete');

        } catch (\Exception $e) {
            return redirect('/login')->with('error', 'Login dengan Google gagal.');
        }
    }
}