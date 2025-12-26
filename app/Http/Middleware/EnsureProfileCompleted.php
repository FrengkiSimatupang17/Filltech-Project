<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureProfileCompleted
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Cek hanya untuk role Client
        if ($user && $user->role === 'client') {
            
            // Definisi "Data Belum Lengkap"
            // 1. Nomor HP kosong
            // 2. Alamat, RT, atau RW masih strip '-' (Data dummy dari Google Login)
            if (
                empty($user->phone_number) || 
                $user->alamat === '-' || 
                $user->rt === '-' || 
                $user->rw === '-'
            ) {
                // Izinkan akses hanya ke halaman edit profile, update profile, dan logout
                // Agar tidak terjadi "Too many redirects" (Infinite Loop)
                if (
                    !$request->routeIs('profile.edit') && 
                    !$request->routeIs('profile.update') && 
                    !$request->routeIs('logout')
                ) {
                    return redirect()->route('profile.edit')
                        ->with('warning', 'Mohon lengkapi data Alamat dan Nomor HP Anda sebelum melanjutkan.');
                }
            }
        }

        return $next($request);
    }
}