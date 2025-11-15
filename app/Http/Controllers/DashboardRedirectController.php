<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardRedirectController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = Auth::user();

        if ($user->role === 'administrator') {
            return Inertia::render('Dashboard/AdminDashboard');
        }

        if ($user->role === 'teknisi') {
            return Inertia::render('Dashboard/TeknisiDashboard');
        }

        if ($user->role === 'client') {
            return Inertia::render('Dashboard/ClientDashboard');
        }

        // Fallback default, meskipun seharusnya tidak terjadi
        return Inertia::render('Dashboard');
    }
}