<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        //
    ];

    public function boot(): void
    {
        Gate::define('is-admin', function (User $user) {
            return $user->role === 'administrator';
        });

        Gate::define('is-teknisi', function (User $user) {
            return $user->role === 'teknisi';
        });

        Gate::define('is-client', function (User $user) {
            return $user->role === 'client';
        });
    }
}