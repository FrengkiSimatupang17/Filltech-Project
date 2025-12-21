<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return array_merge(parent::share($request), [
            
            // 1. DATA USER (Standar)
            'auth' => [
                'user' => $user,
            ],

            // 2. DATA NOTIFIKASI (ROOT LEVEL)
            // Kita taruh di luar 'auth' agar aman dari overwrite default Laravel/Breeze
            'notifications' => $user 
                ? $user->unreadNotifications()->latest()->take(5)->get() 
                : [],

            // 3. JUMLAH BELUM DIBACA (ROOT LEVEL)
            'unreadCount' => $user 
                ? $user->unreadNotifications()->count() 
                : 0,

            // 4. FLASH MESSAGE
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}